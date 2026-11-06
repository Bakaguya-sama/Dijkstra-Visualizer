import type { Graph, NodeId, TraceStep } from '../model/types';
import { compareNodeIds } from './validate';

export function buildPaths(source: NodeId, target: NodeId, predecessors: Record<NodeId, NodeId[]>): NodeId[][] {
  const paths: NodeId[][] = [];
  const visit = (node: NodeId, reversed: NodeId[], seen: Set<NodeId>) => {
    if (seen.has(node)) return;
    if (node === source) { paths.push([source, ...reversed]); return; }
    const nextSeen = new Set(seen).add(node);
    for (const predecessor of [...(predecessors[node] ?? [])].sort(compareNodeIds)) visit(predecessor, [node, ...reversed], nextSeen);
  };
  visit(target, [], new Set());
  return paths.sort((a, b) => {
    for (let index = 0; index < Math.min(a.length, b.length); index += 1) {
      const order = compareNodeIds(a[index], b[index]);
      if (order) return order;
    }
    return a.length - b.length;
  });
}

export function buildTrace(graph: Graph, source: NodeId, target: NodeId, labels: Record<NodeId, number>, predecessors: Record<NodeId, NodeId[]>): TraceStep[] {
  const steps: TraceStep[] = [];
  const queue = [target];
  const visited = new Set<NodeId>();
  while (queue.length) {
    const node = queue.shift()!;
    if (node === source || visited.has(node)) continue;
    visited.add(node);
    const via = [...(predecessors[node] ?? [])].sort(compareNodeIds);
    const equations = via.map((predecessor) => {
      const edge = graph.edges.find((candidate) => graph.directed ? candidate.from === predecessor && candidate.to === node : (candidate.from === predecessor && candidate.to === node) || (candidate.to === predecessor && candidate.from === node));
      return `${labels[predecessor]} + ${edge?.weight ?? 0} = ${labels[node]}`;
    });
    steps.push({ node, via, equations });
    queue.push(...via);
  }
  return steps;
}
