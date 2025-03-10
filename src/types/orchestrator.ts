
export type MachineStatus = 'active' | 'idle' | 'error' | 'offline';

export type ProcessStatus = 'running' | 'completed' | 'failed' | 'pending' | 'stopped';

export interface Machine {
  id: string;
  name: string;
  status: MachineStatus;
  ipAddress: string;
  lastSeen: string;
  description: string;
  processCount: number;
  cpuUsage: number;
  memoryUsage: number;
}

export interface Process {
  id: string;
  name: string;
  status: ProcessStatus;
  machineId: string;
  startTime: string;
  endTime?: string;
  duration?: string;
  description: string;
  type: string;
}

export interface ApiExecutionRequest {
  processId: string;
  parameters?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high';
}

export interface ApiExecutionResponse {
  executionId: string;
  status: 'queued' | 'started' | 'failed';
  message?: string;
}

export interface NewMachineForm {
  name: string;
  ipAddress: string;
  description: string;
  status: MachineStatus;
}

export interface NewProcessForm {
  name: string;
  description: string;
  type: string;
  machineId: string;
}

export interface ProcessAssignmentForm {
  processId: string;
  machineId: string;
  parameters?: Record<string, any>;
}
