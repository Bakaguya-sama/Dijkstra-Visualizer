export type NodeId = string;
export type EditorMode = 'select' | 'connect';
export interface GraphNode { id: NodeId; label: string }
export interface GraphEdge { id: string; from: NodeId; to: NodeId; weight: number }
export interface Graph { directed: boolean; nodes: GraphNode[]; edges: GraphEdge[] }
export type Layout = Record<NodeId, { x: number; y: number }>;
export interface GraphDocument { version: 1; graph: Graph; layout: Layout; source: NodeId | null; target: NodeId | null }
export interface RelaxInfo { to: NodeId; edgeId: string; oldLabel: number; candidate: number; newLabel: number; updated: boolean }
export type SnapshotPhase = 'init' | 'select' | 'relax' | 'done';
export interface Snapshot { step: number; phase: SnapshotPhase; current: NodeId | null; labels: Record<NodeId, number>; permanent: NodeId[]; predecessors: Record<NodeId, NodeId[]>; relaxations: RelaxInfo[]; tieBetween: NodeId[] | null; explanation: string }
export interface TraceStep { node: NodeId; via: NodeId[]; equations: string[] }
export interface DijkstraResult { snapshots: Snapshot[]; distance: number | null; distances: Record<NodeId, number>; paths: NodeId[][]; trace: TraceStep[] }
export interface ValidationIssue { code: string; message: string }
export interface SerializedGraph { version: number; directed: boolean; nodes: Array<{ id: string; label: string; x: number; y: number }>; edges: Array<{ id?: string; from: string; to: string; weight: number }>; source: string | null; target: string | null }
