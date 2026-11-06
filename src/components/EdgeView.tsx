import { BaseEdge, EdgeLabelRenderer, type Edge, type EdgeProps } from '@xyflow/react';
import { memo, useState, type KeyboardEvent } from 'react';
import { vi } from '../i18n/vi';
type EdgeAnchors={sourceX:number;sourceY:number;targetX:number;targetY:number};
export type VisualEdgeData={weight:number;active:boolean;onPath:boolean;anchors:EdgeAnchors;onWeight:(weight:number)=>void;onDelete:()=>void};
export type VisualEdge=Edge<VisualEdgeData,'visual'>;
function TrashIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5"/></svg>}
export const EdgeView=memo(function EdgeView(props:EdgeProps<VisualEdge>){
  const anchors=props.data?.anchors??{sourceX:props.sourceX,sourceY:props.sourceY,targetX:props.targetX,targetY:props.targetY};
  const path=`M ${anchors.sourceX},${anchors.sourceY} L ${anchors.targetX},${anchors.targetY}`;
  const labelX=(anchors.sourceX+anchors.targetX)/2;const labelY=(anchors.sourceY+anchors.targetY)/2;
  const [editing,setEditing]=useState(false);const [value,setValue]=useState(String(props.data?.weight??0));
  const save=()=>{const weight=Number(value);if(value.trim()!==''&&Number.isFinite(weight)&&weight>=0)props.data?.onWeight(weight);else setValue(String(props.data?.weight??0));setEditing(false);};
  const key=(event:KeyboardEvent<HTMLInputElement>)=>{if(event.key==='Enter')save();if(event.key==='Escape'){setValue(String(props.data?.weight??0));setEditing(false);}};
  const change=(delta:number)=>props.data?.onWeight(Math.max(0,(props.data?.weight??0)+delta));
  return <><BaseEdge path={path} markerEnd={props.markerEnd} className={`${props.data?.active?'edge-active':''}${props.data?.onPath?' edge-path':''}`}/><EdgeLabelRenderer>
    <div className="edge-label nodrag nopan" style={{transform:`translate(-50%, -50%) translate(${labelX}px,${labelY}px)`}} onDoubleClick={()=>setEditing(true)}>{editing?<input aria-label={vi.editWeight} autoFocus value={value} onChange={event=>setValue(event.target.value)} onKeyDown={key} onBlur={save}/>:props.data?.weight}</div>
    {props.selected&&<div className="edge-toolbar nodrag nopan nowheel" role="toolbar" aria-label="Thao tác cạnh" style={{transform:`translate(-50%, -100%) translate(${labelX}px,${labelY-18}px)`}} onPointerDown={event=>event.stopPropagation()} onClick={event=>event.stopPropagation()}>
      <button aria-label={vi.decreaseWeight} onClick={()=>change(-1)}>−</button>
      <button className="edge-toolbar-weight" aria-label={vi.editWeight} onClick={()=>setEditing(true)}>{props.data?.weight}</button>
      <button aria-label={vi.increaseWeight} onClick={()=>change(1)}>+</button>
      <span aria-hidden="true" />
      <button className="edge-delete" aria-label={vi.deleteEdge} onClick={props.data?.onDelete}><TrashIcon/></button>
    </div>}
  </EdgeLabelRenderer></>;
});
