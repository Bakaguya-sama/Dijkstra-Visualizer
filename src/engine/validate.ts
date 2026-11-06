import type { Graph, NodeId, ValidationIssue } from '../model/types';

export const MAX_NODES = 50;
export const MAX_EDGES = 200;

export function compareNodeIds(a: NodeId, b: NodeId): number {
  const integer = /^-?\d+$/;
  if (integer.test(a) && integer.test(b)) {
    const numeric = Number(a) - Number(b);
    return numeric || a.localeCompare(b);
  }
  return a.localeCompare(b);
}

export function validateGraph(graph: Graph, source?: NodeId | null, target?: NodeId | null): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (graph.nodes.length > MAX_NODES) issues.push({ code: 'node-limit', message: `Đồ thị có tối đa ${MAX_NODES} node. Hãy xóa bớt node.` });
  if (graph.edges.length > MAX_EDGES) issues.push({ code: 'edge-limit', message: `Đồ thị có tối đa ${MAX_EDGES} cạnh. Hãy xóa bớt cạnh.` });
  const nodeIds = new Set<NodeId>();
  for (const node of graph.nodes) {
    if (!node.id) issues.push({ code: 'empty-node-id', message: 'ID node không được để trống.' });
    if (nodeIds.has(node.id)) issues.push({ code: 'duplicate-node-id', message: `ID node "${node.id}" bị trùng. Hãy đổi ID.` });
    nodeIds.add(node.id);
  }
  const pairs = new Set<string>();
  const edgeIds = new Set<string>();
  for (const edge of graph.edges) {
    if (!edge.id) issues.push({ code: 'empty-edge-id', message: 'ID cạnh không được để trống.' });
    if (edgeIds.has(edge.id)) issues.push({ code: 'duplicate-edge-id', message: `ID cạnh "${edge.id}" bị trùng.` });
    edgeIds.add(edge.id);
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) issues.push({ code: 'missing-endpoint', message: `Cạnh ${edge.id || '(chưa có ID)'} tham chiếu node không tồn tại. Hãy sửa hai đầu cạnh.` });
    if (edge.from === edge.to) issues.push({ code: 'self-loop', message: `Không cho phép cạnh tự nối tại node ${edge.from}.` });
    if (typeof edge.weight !== 'number' || !Number.isFinite(edge.weight) || edge.weight < 0) issues.push({ code: 'invalid-weight', message: `Trọng số cạnh ${edge.id || '(chưa có ID)'} phải là số hữu hạn và không âm.` });
    const pair = graph.directed ? `${edge.from}\u0000${edge.to}` : [edge.from, edge.to].sort(compareNodeIds).join('\u0000');
    if (pairs.has(pair)) issues.push({ code: 'duplicate-edge', message: `Cạnh ${edge.from}${graph.directed ? '→' : '—'}${edge.to} bị trùng. Hãy sửa trọng số cạnh cũ.` });
    pairs.add(pair);
  }
  if (source !== undefined && source !== null && !nodeIds.has(source)) issues.push({ code: 'invalid-source', message: `Nguồn ${source} không tồn tại. Hãy chọn lại nguồn.` });
  if (target !== undefined && target !== null && !nodeIds.has(target)) issues.push({ code: 'invalid-target', message: `Đích ${target} không tồn tại. Hãy chọn lại đích.` });
  if (source !== undefined && source !== null && target !== undefined && target !== null && source === target) issues.push({ code: 'same-endpoints', message: 'Nguồn và đích phải là hai node khác nhau. Hãy chọn lại một trong hai.' });
  return issues;
}
