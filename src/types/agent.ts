
export type AgentStatus = 'active' | 'inactive' | 'updating' | 'error';

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  version: string;
  type: string;
  machineIds: string[];  // Changed from machineId to machineIds array
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
  machineIds: string[];  // Changed from machineId to machineIds array
  description: string;
  configuration: Record<string, any>;
}
