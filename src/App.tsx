import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { Canvas } from './components/Canvas';
import { Controls } from './components/Controls';
import { DetailedExplanation } from './components/DetailedExplanation';
import { LabelTable } from './components/LabelTable';
import { Result } from './components/Result';
import { Toolbar } from './components/Toolbar';
import { runDijkstra } from './engine/dijkstra';
import { vi } from './i18n/vi';
import { createEditorState, graphReducer, type EditorAction } from './model/graphReducer';
import { exportGraphJson, importGraphJson } from './model/serialize';
import type { GraphDocument } from './model/types';
import { presetA } from './presets/samples';

type Theme = 'light' | 'dark';
const editableTarget = (target: EventTarget | null) => target instanceof HTMLElement && (target.matches('input,select,textarea') || target.isContentEditable);
const sameIds = (left: string[], right: string[]) => left.length === right.length && left.every((id, index) => id === right[index]);
const panelMaximum = () => Math.max(320, Math.min(1200, window.innerWidth - 480));
const emptyDocument: GraphDocument = { version: 1, graph: { directed: false, nodes: [], edges: [] }, layout: {}, source: null, target: null };
const PanelChevron = ({ direction }: { direction: 'left' | 'right' }) => <svg className="panel-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d={direction === 'left' ? 'm15 5-7 7 7 7' : 'm9 5 7 7-7 7'} /></svg>;
const TrashIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" /></svg>;

export default function App() {
  const [editor, dispatch] = useReducer(graphReducer, emptyDocument, createEditorState);
  const document = editor.present;
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [panelOpen, setPanelOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [panelWidth, setPanelWidth] = useState(() => Math.min(500, Math.max(320, window.innerWidth * .4)));
  const [theme, setTheme] = useState<Theme>(() => localStorage.getItem('dijkstra-theme') === 'dark' ? 'dark' : 'light');
  const [fullscreen, setFullscreen] = useState(false);
  const [resetViewToken, setResetViewToken] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const wasFinished = useRef(false);

  const result = useMemo(() => document.source ? runDijkstra(document.graph, document.source, document.target) : null, [document.graph, document.source, document.target]);
  const snapshots = result?.snapshots ?? [];
  const last = Math.max(0, snapshots.length - 1);
  const snapshot = snapshots[Math.min(step, last)] ?? null;
  const finished = snapshot?.phase === 'done';
  const path = useMemo(() => finished && result?.paths[0] ? result.paths[0] : [], [finished, result]);

  useEffect(() => { localStorage.setItem('dijkstra-theme', theme); }, [theme]);
  useEffect(() => {
    const updateFullscreen = () => setFullscreen(globalThis.document.fullscreenElement === workspaceRef.current);
    globalThis.document.addEventListener('fullscreenchange', updateFullscreen);
    return () => globalThis.document.removeEventListener('fullscreenchange', updateFullscreen);
  }, []);
  useEffect(() => { setStep((current) => Math.min(current, last)); }, [last]);
  useEffect(() => {
    if (finished && !wasFinished.current) setPanelOpen(true);
    wasFinished.current = Boolean(finished);
  }, [finished]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setStep((current) => {
      if (current >= last) { setPlaying(false); return current; }
      return current + 1;
    }), speed);
    return () => window.clearInterval(timer);
  }, [playing, speed, last]);

  const edit = useCallback((action: EditorAction, layoutOnly = false) => {
    if (!layoutOnly && (step > 0 || playing)) { setMessage(vi.editReset); setStep(0); setPlaying(false); }
    dispatch(action);
  }, [step, playing]);
  const setIndex = useCallback((index: number) => { setPlaying(false); setStep(index); }, []);
  const togglePlaying = useCallback(() => {
    if (!result) return;
    if (playing) { setPlaying(false); return; }
    if (step >= last) setStep(0);
    setPlaying(true);
  }, [last, playing, result, step]);
  const removeSelected = useCallback(() => {
    if (!selectedEdges.length && !selectedNodes.length) return;
    edit({ type: 'delete-elements', nodeIds: selectedNodes, edgeIds: selectedEdges });
    setSelectedEdges([]); setSelectedNodes([]);
  }, [edit, selectedEdges, selectedNodes]);
  const selectElements = useCallback((nodes: string[], edges: string[]) => {
    setSelectedNodes((current) => sameIds(current, nodes) ? current : nodes);
    setSelectedEdges((current) => sameIds(current, edges) ? current : edges);
  }, []);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.defaultPrevented || editableTarget(event.target)) return;
      if (event.key === 'ArrowLeft') { event.preventDefault(); setIndex(Math.max(0, step - 1)); }
      else if (event.key === 'ArrowRight') { event.preventDefault(); setIndex(Math.min(last, step + 1)); }
      else if (event.key === 'Home') { event.preventDefault(); setIndex(0); }
      else if (event.key === 'End') { event.preventDefault(); setIndex(last); }
      else if (event.key === 'Backspace' && (selectedNodes.length || selectedEdges.length)) { event.preventDefault(); removeSelected(); }
      else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); edit({ type: event.shiftKey ? 'redo' : 'undo' }); }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [edit, last, removeSelected, selectedEdges.length, selectedNodes.length, setIndex, step]);

  const addNode = useCallback((x: number, y: number) => {
    let number = 1;
    const ids = new Set(document.graph.nodes.map((node) => node.id));
    while (ids.has(String(number))) number += 1;
    edit({ type: 'add-node', node: { id: String(number), label: String(number) }, position: { x, y } });
  }, [document.graph.nodes, edit]);
  const addEdge = useCallback((from: string, to: string) => {
    let number = 1;
    const ids = new Set(document.graph.edges.map((edge) => edge.id));
    while (ids.has(`e${number}`)) number += 1;
    edit({ type: 'add-edge', edge: { id: `e${number}`, from, to, weight: 1 } });
  }, [document.graph.edges, edit]);
  const moveNode = useCallback((id: string, x: number, y: number) => edit({ type: 'move-node', id, position: { x, y } }, true), [edit]);
  const renameNode = useCallback((id: string, label: string) => edit({ type: 'rename-node', id, label }), [edit]);
  const updateWeight = useCallback((id: string, weight: number) => edit({ type: 'update-edge', id, weight }), [edit]);
  const deleteEdge = useCallback((id: string) => { edit({ type: 'delete-edge', id }); setSelectedEdges((current) => current.filter((edgeId) => edgeId !== id)); }, [edit]);
  const toggleFullscreen = useCallback(() => {
    if (globalThis.document.fullscreenElement) void globalThis.document.exitFullscreen();
    else void workspaceRef.current?.requestFullscreen();
  }, []);
  const toggleTable = useCallback(() => setPanelOpen((current) => {
    const next = !current;
    if (next && window.innerWidth >= 960) setPanelWidth((width) => Math.max(width, Math.min(760, panelMaximum())));
    return next;
  }), []);
  const loadCanvas = useCallback((nextDocument: GraphDocument) => {
    dispatch({ type: 'replace', document: nextDocument });
    setSelectedNodes([]); setSelectedEdges([]); setStep(0); setPlaying(false); setPanelOpen(false); setMessage(null);
    setResetViewToken((value) => value + 1);
  }, []);
  const resetCanvas = useCallback(() => loadCanvas(emptyDocument), [loadCanvas]);
  const loadExample = useCallback(() => loadCanvas(presetA), [loadCanvas]);
  const resizePanel = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;
    event.preventDefault();
    const move = (pointer: PointerEvent) => {
      const right = workspaceRef.current?.getBoundingClientRect().right ?? window.innerWidth;
      setPanelWidth(Math.max(320, Math.min(panelMaximum(), right - pointer.clientX)));
    };
    const stop = () => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop);
      globalThis.document.body.classList.remove('resizing-panel');
    };
    globalThis.document.body.classList.add('resizing-panel');
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', stop);
  }, []);
  const resizeWithKeyboard = useCallback((direction: number) => setPanelWidth((width) => Math.max(320, Math.min(panelMaximum(), width + direction * 24))), []);
  const importText = (text: string) => { try { edit({ type: 'replace', document: importGraphJson(text) }); setMessage(null); } catch (error) { setMessage(error instanceof Error ? error.message : vi.invalidGraph); } };
  const exportFile = () => {
    const blob = new Blob([exportGraphJson(document)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const anchor = globalThis.document.createElement('a');
    anchor.href = url; anchor.download = 'dijkstra-graph.json'; anchor.click(); URL.revokeObjectURL(url);
  };

  const workspaceStyle = { '--panel-current-w': `${panelWidth}px` } as CSSProperties;
  return <main className={`app theme-${theme}`}><h1 className="sr-only">{vi.appName}</h1><div ref={workspaceRef} style={workspaceStyle} className={`workspace${result && panelOpen ? ' with-panel' : ''}`}>
    <div className="canvas-area">
      <Canvas document={document} snapshot={snapshot} path={path} theme={theme} onTheme={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')} onAddNode={addNode} onMove={moveNode} onConnect={addEdge} onRename={renameNode} onWeight={updateWeight} onDeleteEdge={deleteEdge} onSelect={selectElements} selectedNodes={selectedNodes} selectedEdges={selectedEdges} resetViewToken={resetViewToken} />
      <Toolbar directed={document.graph.directed} canUndo={editor.past.length > 0} canRedo={editor.future.length > 0} fullscreen={fullscreen} onToggle={() => edit({ type: 'toggle-directed' })} onUndo={() => edit({ type: 'undo' })} onRedo={() => edit({ type: 'redo' })} onImport={() => inputRef.current?.click()} onExport={exportFile} onFullscreen={toggleFullscreen} onReset={resetCanvas} onExample={loadExample} />
      {result && <Controls index={step} count={snapshots.length} playing={playing} speed={speed} showTable={panelOpen} onIndex={setIndex} onPlaying={togglePlaying} onSpeed={setSpeed} onTable={toggleTable} />}
      <div className="selectors floating"><label><span className="selector-label">{vi.source}</span><select value={document.source ?? ''} onChange={(event) => { dispatch({ type: 'set-source', id: event.target.value || null }); setStep(0); setPlaying(false); }}><option value="">{vi.choose}</option>{document.graph.nodes.map((node) => <option value={node.id} key={node.id} disabled={document.target === node.id}>{node.label}</option>)}</select></label><label><span className="selector-label">{vi.target}</span><select value={document.target ?? '__all'} onChange={(event) => { dispatch({ type: 'set-target', id: event.target.value === '__all' ? null : event.target.value }); setStep(0); setPlaying(false); }}><option value="__all">{vi.allNodes}</option>{document.graph.nodes.map((node) => <option value={node.id} key={node.id} disabled={document.source === node.id}>{node.label}</option>)}</select></label>{(selectedNodes.length > 0 || selectedEdges.length > 0) && <button className="mobile-delete" aria-label={vi.deleteSelection} title={vi.deleteSelection} onClick={removeSelected}><TrashIcon /></button>}</div>
      {(message || editor.error) && <div className="notice" role="status">{message ?? editor.error}<button onClick={() => { setMessage(null); dispatch({ type: 'clear-error' }); }}>{vi.close}</button></div>}
      {result && !panelOpen && <button className="panel-toggle-closed" aria-label={vi.showResult} title={vi.showResult} onClick={toggleTable}><PanelChevron direction="left" /></button>}
    </div>
    {result && panelOpen && <><div className="panel-resizer" role="separator" aria-label={vi.resizePanel} aria-orientation="vertical" aria-valuemin={320} aria-valuemax={panelMaximum()} aria-valuenow={Math.round(panelWidth)} tabIndex={0} onPointerDown={resizePanel} onKeyDown={(event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); resizeWithKeyboard(1); } if (event.key === 'ArrowRight') { event.preventDefault(); resizeWithKeyboard(-1); } }}><button className="panel-toggle" aria-label={vi.hideResult} title={vi.hideResult} onPointerDown={(event) => event.stopPropagation()} onClick={toggleTable}><PanelChevron direction="right" /></button></div><aside className="side-panel open"><button className="drawer-toggle" onClick={toggleTable}>{vi.hideResult}</button><div className="panel-content"><Result result={result} finished={Boolean(finished)} target={document.target} graph={document.graph} />{snapshot && document.source && <div className="analysis-content"><LabelTable graph={document.graph} snapshots={snapshots} current={step} /><DetailedExplanation snapshots={snapshots} current={step} result={result} graph={document.graph} source={document.source} target={document.target} /></div>}</div></aside></>}
  </div><input ref={inputRef} className="sr-only" type="file" accept="application/json,.json" aria-label={vi.importFile} onChange={(event) => { const file = event.target.files?.[0]; if (file) void file.text().then(importText); event.target.value = ''; }} /></main>;
}
