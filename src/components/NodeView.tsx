import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { memo, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { vi } from '../i18n/vi';

export type VisualNodeData = { label:string; distance:number; permanent:boolean; current:boolean; onRename:(label:string)=>void; source:boolean; onPath:boolean; editable:boolean; connectSource:boolean };
export type VisualNode = Node<VisualNodeData,'visual'>;
export const NodeView=memo(function NodeView({ data, selected }: NodeProps<VisualNode>) {
  const [editing,setEditing]=useState(false); const [value,setValue]=useState(data.label);
  const save=()=>{const next=value.trim();if(next)data.onRename(next);else setValue(data.label);setEditing(false);};
  const key=(event:KeyboardEvent<HTMLInputElement>)=>{if(event.key==='Enter')save();if(event.key==='Escape'){setValue(data.label);setEditing(false);}};
  const state=data.onPath?'path':data.permanent?'permanent':Number.isFinite(data.distance)?'temporary':'unvisited';
  const beginEdit=(event:MouseEvent<HTMLDivElement>)=>{if(!data.editable||(event.target as HTMLElement).closest('.react-flow__handle'))return;setValue(data.label);setEditing(true);};
  return <div className={`visual-node node-${state}${data.current?' node-current':''}${selected?' node-selected':''}${data.connectSource?' node-connect-source':''}`} title={`${data.label}: ${Number.isFinite(data.distance)?data.distance:'∞'}`} onDoubleClick={beginEdit}>
    <Handle id="top" type="source" position={Position.Top}/><Handle id="right" type="source" position={Position.Right}/><Handle id="bottom" type="source" position={Position.Bottom}/><Handle id="left" type="source" position={Position.Left}/>
    {Number.isFinite(data.distance) && <span className="node-distance">{data.distance}{data.permanent?'*':''}</span>}
    {editing?<input className="inline-node-input" aria-label={vi.editNode} autoFocus value={value} onChange={event=>setValue(event.target.value)} onKeyDown={key} onBlur={save}/>:<span className="node-label">{data.label}</span>}
    {data.source && <span className="node-mark">s</span>}
  </div>;
});
