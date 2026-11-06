import { vi } from '../i18n/vi';
type Props={index:number;count:number;playing:boolean;speed:number;showTable:boolean;onIndex:(index:number)=>void;onPlaying:()=>void;onSpeed:(speed:number)=>void;onTable:()=>void};
function PlaybackIcon({ playing }:{ playing:boolean }){return playing
  ? <svg className="playback-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
  : <svg className="playback-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5z"/></svg>;
}
export function Controls(props:Props){const last=Math.max(0,props.count-1);const atEnd=props.index===last;return <div className="runbar floating" role="toolbar" aria-label={vi.step}>
  <div className="runbar-main">
    <div className="transport-group">
      <button className="transport" aria-label={vi.start} title={vi.start} onClick={()=>props.onIndex(0)} disabled={!props.index}>|‹</button>
      <button className="transport" aria-label={vi.previous} title={vi.previous} onClick={()=>props.onIndex(Math.max(0,props.index-1))} disabled={!props.index}>‹</button>
      <span className="step-counter" data-testid="step-status">{props.index} / {last}</span>
      <button className="transport" aria-label={vi.next} title={vi.next} onClick={()=>props.onIndex(Math.min(last,props.index+1))} disabled={atEnd}>›</button>
      <button className="transport" aria-label={vi.end} title={vi.end} onClick={()=>props.onIndex(last)} disabled={atEnd}>›|</button>
    </div>
    <span className="runbar-divider" aria-hidden="true" />
    <button className="play-button" aria-label={props.playing?vi.pause:vi.play} title={props.playing?vi.pause:vi.play} onClick={props.onPlaying}><PlaybackIcon playing={props.playing}/></button>
    <label className="speed-control"><span>{vi.speed}</span><select value={props.speed} onChange={event=>props.onSpeed(Number(event.target.value))}><option value="1200">0.5x</option><option value="700">1x</option><option value="350">2x</option></select></label>
    <span className={`run-status${atEnd?' complete':''}`}>{atEnd?vi.complete:`${vi.step} ${props.index}`}</span>
    <button className="table-toggle" onClick={props.onTable}>{props.showTable?vi.hideResultPanel:vi.showResultPanel}</button>
  </div>
  <input className="step-range" aria-label={vi.step} type="range" min="0" max={last} value={props.index} onChange={event=>props.onIndex(Number(event.target.value))}/>
</div>}
