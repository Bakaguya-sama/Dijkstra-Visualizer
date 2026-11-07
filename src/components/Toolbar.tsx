import { vi } from '../i18n/vi';
import type { EditorMode } from '../model/types';

type Props = {
  directed: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onToggle: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onImport: () => void;
  onExport: () => void;
  onFullscreen: () => void;
  fullscreen: boolean;
  onReset: () => void;
  onExample: () => void;
  mode: EditorMode;
  onMode: (mode: EditorMode) => void;
  moreOpen: boolean;
  onMore: () => void;
  theme: 'light' | 'dark';
  onTheme: () => void;
  onHelp: () => void;
};

function UndoIcon() {
  return <svg className="toolbar-action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7 4 12l5 5"/><path d="M5 12h9a6 6 0 1 1 0 12"/></svg>;
}

function RedoIcon() {
  return <svg className="toolbar-action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 7 5 5-5 5"/><path d="M19 12h-9a6 6 0 1 0 0 12"/></svg>;
}

export function Toolbar(props: Props) {
  const runSecondary = (action: () => void) => { action(); if (props.moreOpen) props.onMore(); };
  return <div className="toolbar floating" role="toolbar" aria-label={vi.appName}>
    <div className="toolbar-primary">
      <button className={props.mode==='select'?'active':''} aria-pressed={props.mode==='select'} onClick={()=>props.onMode('select')}>{vi.select}</button>
      <button className={props.mode==='connect'?'active':''} aria-pressed={props.mode==='connect'} onClick={()=>props.onMode('connect')}>{vi.connectMode}</button>
      <button className="toolbar-example-primary" onClick={props.onExample}>{vi.example}</button>
      <button className="toolbar-undo" aria-label={vi.undo} title={vi.undo} disabled={!props.canUndo} onClick={props.onUndo}><span>{vi.undo}</span><UndoIcon /></button>
      <button className="toolbar-redo" aria-label={vi.redo} title={vi.redo} disabled={!props.canRedo} onClick={props.onRedo}><span>{vi.redo}</span><RedoIcon /></button>
      <button className="toolbar-more" aria-label={props.moreOpen?vi.hideMoreTools:vi.moreTools} title={props.moreOpen?vi.hideMoreTools:vi.moreTools} aria-expanded={props.moreOpen} onClick={props.onMore}><span className="vertical-ellipsis" aria-hidden="true"><span/><span/><span/></span></button>
    </div>
    <span className="toolbar-divider" aria-hidden="true" />
    <div className={`toolbar-secondary${props.moreOpen?' open':''}`}>
      <button className="toolbar-direction" onClick={()=>runSecondary(props.onToggle)}>{props.directed ? vi.directed : vi.undirected}</button>
      <button className="toolbar-import" onClick={()=>runSecondary(props.onImport)}>{vi.import}</button>
      <button className="toolbar-export" onClick={()=>runSecondary(props.onExport)}>{vi.export}</button>
      <button className="toolbar-desktop-only toolbar-fullscreen" onClick={()=>runSecondary(props.onFullscreen)}>{props.fullscreen ? vi.exitFullscreen : vi.fullscreen}</button>
      <button className="toolbar-desktop-only toolbar-reset" onClick={()=>runSecondary(props.onReset)} title={vi.resetCanvas}>{vi.reset}</button>
      <button className="toolbar-example" onClick={()=>runSecondary(props.onExample)}>{vi.example}</button>
      <button className="toolbar-mobile-only toolbar-theme" onClick={()=>runSecondary(props.onTheme)}>{props.theme==='dark'?vi.lightTheme:vi.darkTheme}</button>
      <button className="toolbar-mobile-only toolbar-help" onClick={()=>runSecondary(props.onHelp)}>{vi.help}</button>
    </div>
  </div>;
}
