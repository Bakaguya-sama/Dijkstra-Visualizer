import { validateGraph } from '../engine/validate';
import type { GraphDocument, SerializedGraph } from './types';

const fail = (message: string): never => { throw new Error(message); };
export function importGraphJson(text: string): GraphDocument {
  let raw: unknown;
  try { raw=JSON.parse(text); } catch { return fail('JSON không hợp lệ. Hãy kiểm tra dấu phẩy và dấu ngoặc.'); }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return fail('Dữ liệu phải là một object JSON.');
  const data=raw as Record<string,unknown>;
  if(data.version!==1)return fail(`Phiên bản ${String(data.version)} không được hỗ trợ. Hãy dùng version 1.`);
  if(typeof data.directed!=='boolean')return fail('Field directed phải là true hoặc false.');
  if(!Array.isArray(data.nodes)||!Array.isArray(data.edges))return fail('Fields nodes và edges phải là mảng.');
  const nodes=data.nodes.map((value,index)=>{if(!value||typeof value!=='object'||Array.isArray(value))return fail(`Node ${index+1} sai định dạng.`);const node=value as Record<string,unknown>;if(typeof node.id!=='string'||typeof node.label!=='string'||typeof node.x!=='number'||!Number.isFinite(node.x)||typeof node.y!=='number'||!Number.isFinite(node.y))return fail(`Node ${index+1} cần id, label dạng chuỗi và x, y hữu hạn.`);return{id:node.id,label:node.label,x:node.x,y:node.y};});
  const usedIds=new Set<string>(data.edges.flatMap(value=>value&&typeof value==='object'&&!Array.isArray(value)&&typeof (value as Record<string,unknown>).id==='string'?[(value as Record<string,unknown>).id as string]:[]));
  const edges=data.edges.map((value,index)=>{if(!value||typeof value!=='object'||Array.isArray(value))return fail(`Cạnh ${index+1} sai định dạng.`);const edge=value as Record<string,unknown>;if(typeof edge.from!=='string'||typeof edge.to!=='string'||typeof edge.weight!=='number')return fail(`Cạnh ${index+1} cần from, to dạng chuỗi và weight dạng số.`);let id: string;if(edge.id===undefined){id=`edge-${index+1}`;let suffix=1;while(usedIds.has(id))id=`edge-${index+1}-${suffix++}`;}else if(typeof edge.id==='string')id=edge.id;else return fail(`ID cạnh ${index+1} phải là chuỗi.`);usedIds.add(id);return{id,from:edge.from,to:edge.to,weight:edge.weight};});
  const source=data.source;const target=data.target;
  if(source!==null&&typeof source!=='string')return fail('Nguồn phải là ID chuỗi hoặc null.');
  if(target!==null&&typeof target!=='string')return fail('Đích phải là ID chuỗi hoặc null.');
  const graph={directed:data.directed,nodes:nodes.map(({id,label})=>({id,label})),edges};
  const issues=validateGraph(graph,source,target);if(issues.length)return fail(issues.map(issue=>issue.message).join(' '));
  return{version:1,graph,layout:Object.fromEntries(nodes.map(({id,x,y})=>[id,{x,y}])),source,target};
}

export function exportGraphJson(document: GraphDocument): string {
  const output: SerializedGraph={version:1,directed:document.graph.directed,nodes:document.graph.nodes.map(node=>({...node,...(document.layout[node.id]??{x:0,y:0})})),edges:document.graph.edges.map(edge=>({...edge})),source:document.source,target:document.target};
  return JSON.stringify(output,null,2);
}
