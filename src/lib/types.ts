export interface AgentUpdate {
  event_type: string;
  updated_node: string;
  event_status: "running" | "finished" | "streaming";
  node_status: "running" | "finished" | "streaming";
  duration: number;
  startTime: number;
}
