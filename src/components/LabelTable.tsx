import { vi } from '../i18n/vi';
import type { Graph, Snapshot } from '../model/types';

export function LabelTable({ graph, snapshots, current }: { graph: Graph; snapshots: Snapshot[]; current: number }) {
  const labels = new Map(graph.nodes.map((node) => [node.id, node.label]));
  const labelOf = (id: string) => labels.get(id) ?? id;

  return <section className="label-table-section">
    <div className="section-heading"><h2>{vi.stepTable}</h2><p className="note">{vi.permanentNote}</p></div>
    <div className="table-scroll"><table>
      <thead><tr><th>{vi.step}</th><th>{vi.fixedNode}</th>{graph.nodes.map((node) => <th key={node.id}>{vi.node} {node.label}</th>)}</tr></thead>
      <tbody>{snapshots.slice(0, current + 1).map((snapshot) => <tr key={snapshot.step} className={snapshot.step === current ? 'current-row' : ''}>
        <th scope="row">{snapshot.step}</th>
        <td>{snapshot.current ? labelOf(snapshot.current) : '—'}</td>
        {graph.nodes.map((node) => <td key={node.id} className={snapshot.relaxations.some((item) => item.to === node.id && item.updated) ? 'changed' : snapshot.phase === 'select' && snapshot.current === node.id ? 'fixed' : ''}>
          {Number.isFinite(snapshot.labels[node.id]) ? snapshot.labels[node.id] : '∞'}
          {snapshot.permanent.includes(node.id) ? '*' : snapshot.predecessors[node.id]?.length ? ` (${snapshot.predecessors[node.id].map(labelOf).join(', ')})` : ''}
        </td>)}
      </tr>)}</tbody>
    </table></div>
  </section>;
}
