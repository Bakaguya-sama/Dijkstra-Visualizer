import type { GraphDocument, GraphEdge, GraphNode, Layout, NodeId } from './types';
import { compareNodeIds, validateGraph } from '../engine/validate';

export interface EditorState { past: GraphDocument[]; present: GraphDocument; future: GraphDocument[]; error: string | null }
export type EditorAction =
  | { type: 'add-node'; node: GraphNode; position: Layout[NodeId] }
  | { type: 'move-node'; id: NodeId; position: Layout[NodeId] }
  | { type: 'rename-node'; id: NodeId; label: string }
  | { type: 'delete-node'; id: NodeId }
  | { type: 'add-edge'; edge: GraphEdge }
  | { type: 'update-edge'; id: string; weight: number }
  | { type: 'delete-edge'; id: string }
  | { type: 'toggle-directed' }
  | { type: 'set-source'; id: NodeId | null }
  | { type: 'set-target'; id: NodeId | null }
  | { type: 'replace'; document: GraphDocument }
  | { type: 'undo' } | { type: 'redo' } | { type: 'clear-error' };

const clone = (document: GraphDocument): GraphDocument => structuredClone(document);
export const createEditorState = (document: GraphDocument): EditorState => ({ past: [], present: clone(document), future: [], error: null });
const commit = (state: EditorState, present: GraphDocument): EditorState => ({ past: [...state.past, clone(state.present)], present, future: [], error: null });

export function graphReducer(state: EditorState, action: EditorAction): EditorState {
  if (action.type === 'undo') { if (!state.past.length) return state; return { past: state.past.slice(0,-1), present: clone(state.past.at(-1)!), future: [clone(state.present),...state.future], error:null }; }
  if (action.type === 'redo') { if (!state.future.length) return state; return { past:[...state.past,clone(state.present)],present:clone(state.future[0]),future:state.future.slice(1),error:null }; }
  if (action.type === 'clear-error') return { ...state, error:null };
  if (action.type === 'replace') return commit(state, clone(action.document));
  if (action.type === 'move-node') {
    return commit(state, { ...state.present, layout: { ...state.present.layout, [action.id]: action.position } });
  }
  const next = clone(state.present);
  switch (action.type) {
    case 'add-node': next.graph.nodes.push(action.node); next.layout[action.node.id]=action.position; break;
    case 'rename-node': next.graph.nodes=next.graph.nodes.map(node=>node.id===action.id?{...node,label:action.label}:node); break;
    case 'delete-node': next.graph.nodes=next.graph.nodes.filter(node=>node.id!==action.id); next.graph.edges=next.graph.edges.filter(edge=>edge.from!==action.id&&edge.to!==action.id); delete next.layout[action.id]; if(next.source===action.id)next.source=null; if(next.target===action.id)next.target=null; break;
    case 'add-edge': { const issues=validateGraph({...next.graph,edges:[...next.graph.edges,action.edge]}); if(issues.length)return{...state,error:issues[0].message}; next.graph.edges.push(action.edge); break; }
    case 'update-edge': if(!Number.isFinite(action.weight)||action.weight<0)return{...state,error:'Trọng số phải là số hữu hạn và không âm.'}; next.graph.edges=next.graph.edges.map(edge=>edge.id===action.id?{...edge,weight:action.weight}:edge); break;
    case 'delete-edge': next.graph.edges=next.graph.edges.filter(edge=>edge.id!==action.id); break;
    case 'toggle-directed': if(next.graph.directed){ const pairs=new Set<string>(); for(const edge of next.graph.edges){const key=[edge.from,edge.to].sort(compareNodeIds).join('\u0000');if(pairs.has(key))return{...state,error:'Không thể chuyển sang vô hướng khi có hai cạnh đối hướng. Hãy xóa hoặc gộp một cạnh trước.'};pairs.add(key);} } next.graph.directed=!next.graph.directed; break;
    case 'set-source': if(action.id!==null&&action.id===next.target)return{...state,error:'Nguồn và đích phải là hai node khác nhau.'};next.source=action.id; break;
    case 'set-target': if(action.id!==null&&action.id===next.source)return{...state,error:'Nguồn và đích phải là hai node khác nhau.'};next.target=action.id; break;
  }
  return commit(state,next);
}
