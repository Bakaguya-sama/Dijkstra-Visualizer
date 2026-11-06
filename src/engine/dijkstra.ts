import { vi } from '../i18n/vi';
import type { DijkstraResult, Graph, NodeId, RelaxInfo, Snapshot } from '../model/types';
import { buildPaths, buildTrace } from './trace';
import { compareNodeIds, validateGraph } from './validate';

const copyRecord = <T>(record: Record<string, T>, copy: (value: T) => T): Record<string, T> => Object.fromEntries(Object.entries(record).map(([key, value]) => [key, copy(value)]));

export function runDijkstra(graph: Graph, source: NodeId, target: NodeId | null): DijkstraResult {
  const issues = validateGraph(graph, source, target);
  if (issues.length) throw new Error(issues.map((issue) => issue.message).join(' '));
  const labels: Record<NodeId, number> = Object.fromEntries(graph.nodes.map((node) => [node.id, Number.POSITIVE_INFINITY]));
  const predecessors: Record<NodeId, NodeId[]> = Object.fromEntries(graph.nodes.map((node) => [node.id, []]));
  const permanent: NodeId[] = [source];
  labels[source] = 0;
  const snapshots: Snapshot[] = [];
  const push = (phase: Snapshot['phase'], current: NodeId | null, relaxations: RelaxInfo[] = [], tieBetween: NodeId[] | null = null, explanation = '') => snapshots.push({ step: snapshots.length, phase, current, labels: { ...labels }, permanent: [...permanent], predecessors: copyRecord(predecessors, (value) => [...value]), relaxations: relaxations.map((item) => ({ ...item })), tieBetween: tieBetween ? [...tieBetween] : null, explanation });
  push('init', source, [], null, vi.init(source));

  const finish = () => {
    const reachable = target === null || Number.isFinite(labels[target]);
    const paths = target !== null && reachable ? buildPaths(source, target, predecessors) : [];
    let explanation: string;
    if (target === null) explanation = vi.doneAll(source);
    else if (!reachable) explanation = vi.doneNone(source, target);
    else if (paths.length > 1) explanation = vi.doneMany(paths.length, labels[target], paths.map((path) => path.join(' → ')).join('; '));
    else explanation = vi.doneOne(source, target, labels[target], paths[0].join(' → '));
    push('done', null, [], null, explanation);
    return { snapshots, distance: target === null || !reachable ? null : labels[target], distances: { ...labels }, paths, trace: target !== null && reachable ? buildTrace(graph, source, target, labels, predecessors) : [] };
  };

  const relax = (current: NodeId) => {
    const relaxationList: RelaxInfo[] = [];
    const outgoing = graph.edges.flatMap((edge) => {
      if (edge.from === current) return [{ to: edge.to, edgeId: edge.id, weight: edge.weight }];
      if (!graph.directed && edge.to === current) return [{ to: edge.from, edgeId: edge.id, weight: edge.weight }];
      return [];
    }).filter(({ to }) => !permanent.includes(to)).sort((a, b) => compareNodeIds(a.to, b.to));
    for (const edge of outgoing) {
      const oldLabel = labels[edge.to];
      const candidate = labels[current] + edge.weight;
      const updated = candidate < oldLabel;
      if (updated) { labels[edge.to] = candidate; predecessors[edge.to] = [current]; }
      else if (candidate === oldLabel && Number.isFinite(oldLabel) && !predecessors[edge.to].includes(current)) predecessors[edge.to].push(current);
      predecessors[edge.to].sort(compareNodeIds);
      relaxationList.push({ to: edge.to, edgeId: edge.edgeId, oldLabel, candidate, newLabel: labels[edge.to], updated });
    }
    push('relax', current, relaxationList, null, outgoing.length ? vi.relaxTitle(current, labels[current]) : vi.noNeighbor(current));
  };

  relax(source);
  while (true) {
    const candidates = graph.nodes.map((node) => node.id).filter((id) => !permanent.includes(id) && Number.isFinite(labels[id]));
    if (!candidates.length) return finish();
    const minimum = Math.min(...candidates.map((id) => labels[id]));
    const ties = candidates.filter((id) => labels[id] === minimum).sort(compareNodeIds);
    const current = ties[0];
    permanent.push(current);
    push('select', current, [], ties.length > 1 ? ties : null, ties.length > 1 ? vi.tie(ties, minimum) : vi.selectNode(current, minimum));
    if (target !== null && current === target) return finish();
    relax(current);
  }
}
