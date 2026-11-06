import { vi } from '../i18n/vi';

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
};

export function Toolbar(props: Props) {
  return <div className="toolbar floating" role="toolbar" aria-label={vi.appName}>
    <button className="active" aria-pressed="true">{vi.select}</button>
    <span className="toolbar-divider" aria-hidden="true" />
    <button onClick={props.onToggle}>{props.directed ? vi.directed : vi.undirected}</button>
    <button disabled={!props.canUndo} onClick={props.onUndo}>{vi.undo}</button>
    <button disabled={!props.canRedo} onClick={props.onRedo}>{vi.redo}</button>
    <span className="toolbar-divider" aria-hidden="true" />
    <button onClick={props.onImport}>{vi.import}</button>
    <button onClick={props.onExport}>{vi.export}</button>
    <button onClick={props.onFullscreen}>{props.fullscreen ? vi.exitFullscreen : vi.fullscreen}</button>
    <button onClick={props.onReset} title={vi.resetCanvas}>{vi.reset}</button>
    <button onClick={props.onExample}>{vi.example}</button>
  </div>;
}
