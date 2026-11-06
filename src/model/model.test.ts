import { describe, expect, it } from 'vitest';
import { presetA } from '../presets/samples';
import { createEditorState, graphReducer } from './graphReducer';
import { exportGraphJson, importGraphJson } from './serialize';

describe('graphReducer',()=>{
  it('undo/redo và xóa node kéo theo cạnh',()=>{let state=createEditorState(presetA);state=graphReducer(state,{type:'delete-node',id:'1'});expect(state.present.graph.nodes).toHaveLength(5);expect(state.present.graph.edges.some(edge=>edge.from==='1'||edge.to==='1')).toBe(false);state=graphReducer(state,{type:'undo'});expect(state.present.graph.nodes).toHaveLength(6);state=graphReducer(state,{type:'redo'});expect(state.present.graph.nodes).toHaveLength(5);});
  it('import/preset là một transaction',()=>{let state=createEditorState(presetA);state=graphReducer(state,{type:'replace',document:{...presetA,source:null}});state=graphReducer(state,{type:'undo'});expect(state.present.source).toBe('1');});
  it('chặn chuyển vô hướng nếu có cạnh đối hướng',()=>{let state=createEditorState({...presetA,graph:{directed:true,nodes:presetA.graph.nodes,edges:[{id:'a',from:'1',to:'2',weight:1},{id:'b',from:'2',to:'1',weight:1}]}});state=graphReducer(state,{type:'toggle-directed'});expect(state.present.graph.directed).toBe(true);expect(state.error).toContain('đối hướng');});
  it('chặn nguồn và đích trùng nhau',()=>{let state=createEditorState(presetA);state=graphReducer(state,{type:'set-target',id:'1'});expect(state.present.target).toBe('6');expect(state.error).toContain('khác nhau');});
});
describe('serialize',()=>{
  it('round-trip giữ graph, layout, lựa chọn và edge ID',()=>expect(importGraphJson(exportGraphJson(presetA))).toEqual(presetA));
  it('sinh edge ID tất định khi preset thiếu ID',()=>{const raw=JSON.parse(exportGraphJson(presetA));delete raw.edges[0].id;expect(importGraphJson(JSON.stringify(raw)).graph.edges[0].id).toBe('edge-1');});
  it.each([['version',{"version":2,"directed":false,"nodes":[],"edges":[],"source":null,"target":null}],['weight',{"version":1,"directed":false,"nodes":[{"id":"1","label":"1","x":0,"y":0}],"edges":[{"from":"1","to":"1","weight":-1}],"source":"1","target":null}]])('từ chối %s',(_,raw)=>expect(()=>importGraphJson(JSON.stringify(raw))).toThrow());
  it('từ chối JSON có nguồn trùng đích',()=>expect(()=>importGraphJson(JSON.stringify({version:1,directed:false,nodes:[{id:'1',label:'1',x:0,y:0}],edges:[],source:'1',target:'1'}))).toThrow(/khác nhau/));
});
