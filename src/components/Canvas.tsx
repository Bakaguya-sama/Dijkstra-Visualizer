import {
  applyNodeChanges,
  Background,
  BackgroundVariant,
  ConnectionMode,
  MarkerType,
  Panel,
  ReactFlow,
  type Connection,
  type NodeChange,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { vi } from '../i18n/vi';
import type { GraphDocument, Layout, Snapshot } from '../model/types';
import { EdgeView, type VisualEdge } from './EdgeView';
import { NodeView, type VisualNode } from './NodeView';
import { ShortcutHelp } from './ShortcutHelp';

const nodeTypes = { visual: NodeView };
const edgeTypes = { visual: EdgeView };
type Theme = 'light' | 'dark';
type Props = {
  document: GraphDocument;
  snapshot: Snapshot | null;
  path: string[];
  theme: Theme;
  onTheme: () => void;
  onAddNode: (x: number, y: number) => void;
  onMove: (id: string, x: number, y: number) => void;
  onConnect: (from: string, to: string) => void;
  onRename: (id: string, label: string) => void;
  onWeight: (id: string, weight: number) => void;
  onSelect: (nodeIds: string[], edgeIds: string[]) => void;
  resetViewToken: number;
};

const handleFor = (from: Layout[string], to: Layout[string]) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? 'right' : 'left';
  return dy >= 0 ? 'bottom' : 'top';
};

const handleAngles = { top: -Math.PI / 2, right: 0, bottom: Math.PI / 2, left: Math.PI } as const;
type HandleId = keyof typeof handleAngles;
const handles = Object.keys(handleAngles) as HandleId[];
const angleDistance = (left: number, right: number) => Math.abs(Math.atan2(Math.sin(left - right), Math.cos(left - right)));

function allocateHandles(graphEdges: GraphDocument['graph']['edges'], positions: Layout) {
  const incidents = new Map<string, Array<{ key: string; angle: number }>>();
  const add = (node: string, key: string, from: Layout[string], to: Layout[string]) => {
    const list = incidents.get(node) ?? [];
    list.push({ key, angle: Math.atan2(to.y - from.y, to.x - from.x) });
    incidents.set(node, list);
  };
  for (const edge of graphEdges) {
    const from = positions[edge.from] ?? { x: 0, y: 0 };
    const to = positions[edge.to] ?? { x: 0, y: 0 };
    add(edge.from, `source:${edge.id}`, from, to);
    add(edge.to, `target:${edge.id}`, to, from);
  }
  const result = new Map<string, HandleId>();
  for (const list of incidents.values()) {
    list.sort((left, right) => left.angle - right.angle || left.key.localeCompare(right.key));
    if (list.length <= handles.length) {
      let best: HandleId[] | null = null;
      let bestScore = Infinity;
      const search = (assigned: HandleId[], available: HandleId[], score: number) => {
        if (assigned.length === list.length) {
          if (score < bestScore) { bestScore = score; best = assigned; }
          return;
        }
        const angle = list[assigned.length].angle;
        for (const handle of available) {
          const nextScore = score + angleDistance(angle, handleAngles[handle]);
          if (nextScore <= bestScore) search([...assigned, handle], available.filter((item) => item !== handle), nextScore);
        }
      };
      search([], handles, 0);
      list.forEach((incident, index) => result.set(incident.key, (best as HandleId[] | null)?.[index] ?? 'right'));
    } else {
      for (const incident of list) {
        const selected = handles.reduce((bestHandle, handle) => angleDistance(incident.angle, handleAngles[handle]) < angleDistance(incident.angle, handleAngles[bestHandle]) ? handle : bestHandle, handles[0]);
        result.set(incident.key, selected);
      }
    }
  }
  return result;
}

export function Canvas({ document, snapshot, path, theme, onTheme, onAddNode, onMove, onConnect, onRename, onWeight, onSelect, resetViewToken }: Props) {
  const instance = useRef<ReactFlowInstance<VisualNode, VisualEdge> | null>(null);
  const lastPaneClick = useRef<{ at: number; x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const pathNodes = useMemo(() => new Set(path), [path]);
  const pathEdges = useMemo(() => new Set(path.slice(1).map((node, index) => `${path[index]}\u0000${node}`)), [path]);
  const computedNodes = useMemo<VisualNode[]>(() => document.graph.nodes.map((node) => ({
    id: node.id,
    type: 'visual',
    position: document.layout[node.id] ?? { x: 0, y: 0 },
    data: {
      label: node.label,
      distance: snapshot?.labels[node.id] ?? Infinity,
      permanent: snapshot?.permanent.includes(node.id) ?? false,
      current: snapshot?.current === node.id,
      onRename: (label) => onRename(node.id, label),
      source: document.source === node.id,
      onPath: pathNodes.has(node.id),
    },
  })), [document.graph.nodes, document.layout, document.source, onRename, pathNodes, snapshot]);
  const [nodes, setNodes] = useState<VisualNode[]>(computedNodes);

  useEffect(() => {
    setNodes((current) => {
      const existing = new Map(current.map((node) => [node.id, node]));
      return computedNodes.map((node) => {
        const previous = existing.get(node.id);
        return { ...node, position: previous?.dragging ? previous.position : node.position, selected: previous?.selected ?? false };
      });
    });
  }, [computedNodes]);
  useEffect(() => {
    if (!resetViewToken) return;
    window.requestAnimationFrame(() => void instance.current?.fitView({ padding: .22, maxZoom: 1.25 }));
  }, [resetViewToken]);

  const changeNodes = useCallback((changes: NodeChange<VisualNode>[]) => {
    setNodes((current) => applyNodeChanges<VisualNode>(changes, current));
  }, []);
  const positions = useMemo(() => Object.fromEntries(nodes.map((node) => [node.id, node.position])), [nodes]);
  const edgeHandles = useMemo(() => allocateHandles(document.graph.edges, { ...document.layout, ...positions }), [document.graph.edges, document.layout, positions]);
  const edges = useMemo<VisualEdge[]>(() => document.graph.edges.map((edge) => {
    const from = positions[edge.from] ?? document.layout[edge.from] ?? { x: 0, y: 0 };
    const to = positions[edge.to] ?? document.layout[edge.to] ?? { x: 0, y: 0 };
    return {
      id: edge.id,
      type: 'visual',
      source: edge.from,
      target: edge.to,
      sourceHandle: edgeHandles.get(`source:${edge.id}`) ?? handleFor(from, to),
      targetHandle: edgeHandles.get(`target:${edge.id}`) ?? handleFor(to, from),
      markerEnd: document.graph.directed ? { type: MarkerType.ArrowClosed } : undefined,
      data: {
        weight: edge.weight,
        active: snapshot?.relaxations.some((item) => item.edgeId === edge.id) ?? false,
        onPath: pathEdges.has(`${edge.from}\u0000${edge.to}`) || (!document.graph.directed && pathEdges.has(`${edge.to}\u0000${edge.from}`)),
        onWeight: (weight) => onWeight(edge.id, weight),
      },
    };
  }), [document.graph.directed, document.graph.edges, document.layout, edgeHandles, onWeight, pathEdges, positions, snapshot]);

  return <ReactFlow<VisualNode, VisualEdge>
    nodes={nodes}
    edges={edges}
    nodeTypes={nodeTypes}
    edgeTypes={edgeTypes}
    fitView
    fitViewOptions={{ padding: .22, maxZoom: 1.25 }}
    minZoom={.2}
    maxZoom={2.5}
    onlyRenderVisibleElements
    deleteKeyCode={null}
    zoomOnDoubleClick={false}
    connectionMode={ConnectionMode.Loose}
    onInit={(flow) => { instance.current = flow; }}
    onMove={(_, viewport) => setZoom(viewport.zoom)}
    onNodesChange={changeNodes}
    onPaneClick={(event) => {
      onSelect([], []);
      const previous = lastPaneClick.current;
      const isDouble = previous && event.timeStamp - previous.at < 420 && Math.hypot(event.clientX - previous.x, event.clientY - previous.y) < 12;
      if (isDouble) {
        const point = instance.current?.screenToFlowPosition({ x: event.clientX, y: event.clientY });
        if (point) onAddNode(point.x, point.y);
        lastPaneClick.current = null;
      } else lastPaneClick.current = { at: event.timeStamp, x: event.clientX, y: event.clientY };
    }}
    onNodeClick={(_, node) => onSelect([node.id], [])}
    onEdgeClick={(_, edge) => onSelect([], [edge.id])}
    onNodeDragStop={(_, node) => onMove(node.id, node.position.x, node.position.y)}
    onConnect={(connection: Connection) => { if (connection.source && connection.target) onConnect(connection.source, connection.target); }}
    nodesConnectable
    elementsSelectable
  >
    <Background variant={BackgroundVariant.Lines} gap={32} size={1} color={theme === 'dark' ? '#303640' : '#d4d0c8'} />
    <Panel position="bottom-left" className="canvas-dock" aria-label="Điều khiển canvas">
      <button aria-label={vi.zoomOut} title={vi.zoomOut} onClick={() => void instance.current?.zoomOut()}>−</button>
      <button className="zoom-value" aria-label={vi.fitView} title={vi.fitView} onClick={() => void instance.current?.fitView({ padding: .22, maxZoom: 1.25 })}>{Math.round(zoom * 100)}%</button>
      <button aria-label={vi.zoomIn} title={vi.zoomIn} onClick={() => void instance.current?.zoomIn()}>+</button>
      <span className="dock-divider" aria-hidden="true" />
      <button className="theme-toggle" aria-label={theme === 'dark' ? vi.lightMode : vi.darkMode} title={theme === 'dark' ? vi.lightMode : vi.darkMode} onClick={onTheme}>{theme === 'dark' ? 'Sáng' : 'Tối'}</button>
    </Panel>
    <Panel position="bottom-right" className="shortcut-panel"><ShortcutHelp /></Panel>
  </ReactFlow>;
}
