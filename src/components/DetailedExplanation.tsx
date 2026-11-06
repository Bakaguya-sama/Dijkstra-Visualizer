import { vi } from '../i18n/vi';
import type { DijkstraResult, Graph, NodeId, Snapshot } from '../model/types';

type Props = {
  snapshots: Snapshot[];
  current: number;
  result: DijkstraResult;
  graph: Graph;
  source: NodeId;
  target: NodeId | null;
};

const finite = (value: number) => Number.isFinite(value) ? String(value) : '∞';

export function DetailedExplanation({ snapshots, current, result, graph, source, target }: Props) {
  const reached = snapshots.slice(0, current + 1);
  const labels = new Map(graph.nodes.map((node) => [node.id, node.label]));
  const labelOf = (id: NodeId) => labels.get(id) ?? id;
  const selected = reached.filter((snapshot) => snapshot.phase === 'select' && snapshot.current).map((snapshot) => snapshot.current!);
  const fixedOrder = [source, ...selected.filter((node, index) => node !== source && selected.indexOf(node) === index)];
  const finished = reached.at(-1)?.phase === 'done';

  return <section className="detailed-explanation">
    <h2>{vi.detailTitle}</h2>
    <article className="detail-step">
      <h3>{vi.detailInitTitle}</h3>
      <p>{vi.detailInit(labelOf(source))}</p>
    </article>
    {fixedOrder.map((node, index) => {
      const selection = node === source ? reached.find((snapshot) => snapshot.phase === 'init') : reached.find((snapshot) => snapshot.phase === 'select' && snapshot.current === node);
      const relaxation = reached.find((snapshot) => snapshot.phase === 'relax' && snapshot.current === node && snapshot.step >= (selection?.step ?? 0));
      if (node === source && !relaxation) return null;
      const distance = selection?.labels[node] ?? relaxation?.labels[node] ?? 0;
      const updatedAny = relaxation?.relaxations.some((item) => item.updated) ?? false;
      return <article className="detail-step" key={`${node}-${index}`}>
        <h3>{vi.detailStepTitle(index + 1, labelOf(node), distance)}</h3>
        <p>{vi.detailSelect(labelOf(node), distance)}</p>
        {relaxation && updatedAny && <>
          <p className="detail-subtitle">{vi.detailNeighbors}</p>
          <ul>{relaxation.relaxations.map((item) => {
            const oldLabel = finite(item.oldLabel);
            const weight = item.candidate - distance;
            return <li key={`${relaxation.step}-${item.edgeId}-${item.to}`}>{item.updated
              ? vi.detailUpdated(labelOf(item.to), oldLabel, labelOf(node), weight, item.candidate, item.newLabel)
              : vi.detailKept(labelOf(item.to), oldLabel, labelOf(node), weight, item.candidate)}</li>;
          })}</ul>
        </>}
        {relaxation && !updatedAny && <p>{vi.detailNoUpdate}</p>}
        {!relaxation && finished && target === node && <p>{vi.detailTargetFixed}</p>}
      </article>;
    })}
    {finished && <article className="detail-trace">
      <h3>{vi.detailTrace}</h3>
      {target === null ? <p>{vi.doneAll(labelOf(source))}</p> : result.paths.length === 0 ? <p>{vi.noPath}</p> : <>
        <p>{vi.detailTraceIntro}</p>
        {result.trace.map((step) => <p className="detail-trace-line" key={step.node}>{vi.detailTraceLine(labelOf(step.node), step.via.map(labelOf).join(' / '))}</p>)}
        {result.paths.map((path) => <p className="detail-conclusion" key={path.join('\u0000')}>{vi.detailConclusion(path.map(labelOf).join(' ➔ '))}</p>)}
      </>}
    </article>}
  </section>;
}
