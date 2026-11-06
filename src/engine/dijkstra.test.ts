import { describe, expect, it } from 'vitest';
import { presetA, presetB, presetC, presetD } from '../presets/samples';
import type { Graph } from '../model/types';
import { runDijkstra } from './dijkstra';
import { compareNodeIds, validateGraph } from './validate';

const labels = (graph: Graph, result: ReturnType<typeof runDijkstra>) => result.snapshots.map((snapshot) => graph.nodes.map((node) => snapshot.labels[node.id]));
describe('Dijkstra chuẩn', () => {
  it('khớp toàn bộ snapshot ví dụ A', () => {
    const result = runDijkstra(presetA.graph, '1', '6');
    expect(result.snapshots).toHaveLength(12); expect(result.distance).toBe(10); expect(result.paths).toEqual([['1','4','5','6']]);
    expect(labels(presetA.graph,result)).toEqual([[0,Infinity,Infinity,Infinity,Infinity,Infinity],[0,3,7,4,Infinity,Infinity],[0,3,7,4,Infinity,Infinity],[0,3,5,4,Infinity,12],[0,3,5,4,Infinity,12],[0,3,5,4,7,12],[0,3,5,4,7,12],[0,3,5,4,7,11],[0,3,5,4,7,11],[0,3,5,4,7,10],[0,3,5,4,7,10],[0,3,5,4,7,10]]);
    expect(result.snapshots[7].predecessors['3']).toEqual(['2','4']);
  });
  it('khớp ví dụ B và C', () => {
    const b = runDijkstra(presetB.graph,'0','4'); expect(b.snapshots).toHaveLength(10); expect(b.distance).toBe(8); expect(b.paths).toEqual([['0','2','4']]); expect(labels(presetB.graph,b)).toEqual([[0,Infinity,Infinity,Infinity,Infinity],[0,3,4,8,10],[0,3,4,8,10],[0,3,4,7,10],[0,3,4,7,10],[0,3,4,6,8],[0,3,4,6,8],[0,3,4,6,8],[0,3,4,6,8],[0,3,4,6,8]]);
    const c = runDijkstra(presetC.graph,'1','4'); expect(c.snapshots).toHaveLength(8); expect(c.snapshots[2].tieBetween).toEqual(['2','3']); expect(c.paths).toEqual([['1','2','4'],['1','3','4']]); expect(labels(presetC.graph,c)).toEqual([[0,Infinity,Infinity,Infinity],[0,2,2,Infinity],[0,2,2,Infinity],[0,2,2,4],[0,2,2,4],[0,2,2,4],[0,2,2,4],[0,2,2,4]]);
  });
  it('chạy hết node và các ca biên', () => {
    expect(runDijkstra(presetA.graph,'1',null).snapshots).toHaveLength(13); expect(runDijkstra(presetB.graph,'0',null).snapshots).toHaveLength(11);
    const missing = runDijkstra(presetD.unreachable.graph,'1','3'); expect(missing.distance).toBeNull(); expect(missing.paths).toEqual([]); expect(missing.distances['3']).toBe(Infinity);
    const single = runDijkstra(presetD.single.graph,'1',null); expect(single.snapshots.map((s)=>s.phase)).toEqual(['init','relax','done']); expect(single.paths).toEqual([]);
    const zero: Graph = {directed:false,nodes:['1','2','3'].map(id=>({id,label:id})),edges:[{id:'a',from:'1',to:'2',weight:0},{id:'b',from:'2',to:'3',weight:4}]}; expect(runDijkstra(zero,'1','3').paths).toEqual([['1','2','3']]);
    const oneWay: Graph = {directed:true,nodes:['1','2'].map(id=>({id,label:id})),edges:[{id:'a',from:'1',to:'2',weight:1}]}; expect(runDijkstra(oneWay,'1','2').distance).toBe(1); expect(runDijkstra(oneWay,'2','1').distance).toBeNull();
  });
  it('so ID số và chuỗi đúng quy tắc', () => { expect(compareNodeIds('2','10')).toBeLessThan(0); expect(compareNodeIds('b','a')).toBeGreaterThan(0); });
  it('không tạo đường lặp với cạnh 0', () => { const graph: Graph={directed:false,nodes:['1','2','3'].map(id=>({id,label:id})),edges:[{id:'a',from:'1',to:'2',weight:0},{id:'b',from:'2',to:'3',weight:0},{id:'c',from:'1',to:'3',weight:0}]}; const result=runDijkstra(graph,'1','3'); expect(result.paths.every(path=>new Set(path).size===path.length)).toBe(true); });
});

describe('validation', () => {
  const nodes = ['1','2','3'].map(id=>({id,label:id}));
  it.each([
    ['âm',{directed:false,nodes,edges:[{id:'e',from:'1',to:'2',weight:-1}]}],
    ['vô hạn',{directed:false,nodes,edges:[{id:'e',from:'1',to:'2',weight:Infinity}]}],
    ['tự nối',{directed:false,nodes,edges:[{id:'e',from:'1',to:'1',weight:1}]}],
    ['endpoint thiếu',{directed:false,nodes,edges:[{id:'e',from:'1',to:'9',weight:1}]}],
    ['trùng vô hướng',{directed:false,nodes,edges:[{id:'e1',from:'1',to:'2',weight:1},{id:'e2',from:'2',to:'1',weight:2}]}],
    ['trùng có hướng',{directed:true,nodes,edges:[{id:'e1',from:'1',to:'2',weight:1},{id:'e2',from:'1',to:'2',weight:2}]}]
  ])('chặn %s',(_,graph)=>expect(validateGraph(graph as Graph)).not.toHaveLength(0));
  it('cho hai cạnh đối hướng ở graph có hướng',()=>expect(validateGraph({directed:true,nodes,edges:[{id:'e1',from:'1',to:'2',weight:1},{id:'e2',from:'2',to:'1',weight:2}]})).toEqual([]));
  it('chặn nguồn và đích trùng nhau',()=>expect(validateGraph({directed:false,nodes,edges:[]},'1','1').some(issue=>issue.code==='same-endpoints')).toBe(true));
  it('chặn ID node trùng và giới hạn kích thước',()=>{expect(validateGraph({directed:false,nodes:[{id:'1',label:'a'},{id:'1',label:'b'}],edges:[]}).some(issue=>issue.code==='duplicate-node-id')).toBe(true);expect(validateGraph({directed:false,nodes:Array.from({length:51},(_,index)=>({id:String(index),label:String(index)})),edges:[]}).some(issue=>issue.code==='node-limit')).toBe(true);});
});

it('đối chiếu 200 graph ngẫu nhiên với Bellman-Ford', () => {
  let seed=20250308; const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  for(let sample=0;sample<200;sample+=1){ const count=2+Math.floor(random()*7); const graph:Graph={directed:random()>.5,nodes:Array.from({length:count},(_,i)=>({id:String(i),label:String(i)})),edges:[]}; let edgeId=0; for(let a=0;a<count;a+=1)for(let b=a+1;b<count;b+=1)if(random()<.3){const reverse=graph.directed&&random()<.5; graph.edges.push({id:`e${edgeId++}`,from:String(reverse?b:a),to:String(reverse?a:b),weight:Math.floor(random()*10)});} const expected=Array(count).fill(Infinity); expected[0]=0; for(let pass=0;pass<count-1;pass+=1)for(const edge of graph.edges){expected[Number(edge.to)]=Math.min(expected[Number(edge.to)],expected[Number(edge.from)]+edge.weight); if(!graph.directed)expected[Number(edge.from)]=Math.min(expected[Number(edge.from)],expected[Number(edge.to)]+edge.weight);} const actual=runDijkstra(graph,'0',null).distances; expect(graph.nodes.map(node=>actual[node.id])).toEqual(expected); }
});
