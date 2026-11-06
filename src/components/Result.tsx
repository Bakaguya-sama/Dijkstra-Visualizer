import { vi } from '../i18n/vi';
import type { DijkstraResult, Graph, NodeId } from '../model/types';

export function Result({ result, finished, target, graph }: { result: DijkstraResult; finished: boolean; target: string | null; graph: Graph }) {
  const labels = new Map(graph.nodes.map((node) => [node.id, node.label]));
  const labelOf = (id: NodeId) => labels.get(id) ?? id;

  return <section className="result">
    <div className="result-heading"><h2>{vi.result}</h2><span className={`result-status${finished ? ' done' : ''}`}>{finished ? vi.complete : 'Đang chạy'}</span></div>
    {!finished ? <p className="result-empty">{vi.notFinished}</p> : target === null ? <div className="distance-grid">{Object.entries(result.distances).map(([node, distance]) => <article className="distance-item" key={node}><span>{vi.node} {labelOf(node)}</span><strong>{Number.isFinite(distance) ? distance : '∞'}</strong></article>)}</div> : result.distance === null ? <p className="result-empty">{vi.noPath}</p> : <>
      <article className="distance-card"><span>{vi.distance}</span><strong>{result.distance}</strong></article>
      <div className="result-block"><h3>{result.paths.length > 1 ? vi.paths : vi.path}</h3>{result.paths.map((path) => <p className="path-line" key={path.join('-')}>{path.map(labelOf).join(' → ')}</p>)}</div>
    </>}
  </section>;
}
