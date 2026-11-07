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

export function Toolbar(props: Props) {
  const runSecondary = (action: () => void) => { action(); if (props.moreOpen) props.onMore(); };
  return <div className="toolbar floating" role="toolbar" aria-label={vi.appName}>
    <div className="toolbar-primary">
      <button className={props.mode==='select'?'active':''} aria-pressed={props.mode==='select'} onClick={()=>props.onMode('select')}>{vi.select}</button>
      <button className={props.mode==='connect'?'active':''} aria-pressed={props.mode==='connect'} onClick={()=>props.onMode('connect')}>{vi.connectMode}</button>
      <button disabled={!props.canUndo} onClick={props.onUndo}>{vi.undo}</button>
      <button disabled={!props.canRedo} onClick={props.onRedo}>{vi.redo}</button>
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
