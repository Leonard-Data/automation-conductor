
export type AgentStatus = 'active' | 'inactive' | 'updating' | 'error';

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  version: string;
  type: string;
  machineId: string;
  lastUpdated: string;
  description: string;
  configuration: Record<string, any>;
}

export interface AgentTypeCount {
  type: string;
  count: number;
}

export interface NewAgentForm {
  name: string;
  type: string;
  machineId: string;
  description: string;
  configuration: Record<string, any>;
}
