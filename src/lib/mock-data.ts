import { Machine, Process, NewMachineForm, NewProcessForm, ProcessAssignmentForm } from "@/types/orchestrator";
import { Agent, AgentTypeCount, NewAgentForm } from "@/types/agent";

// Mock Machines Data
export const machines: Machine[] = [
  {
    id: "machine-001",
    name: "Production Server",
    status: "active",
    ipAddress: "192.168.1.100",
    lastSeen: new Date(Date.now() - 5 * 60000).toISOString(),
    description: "Main production server running critical workflows",
    processCount: 8,
    cpuUsage: 42,
    memoryUsage: 64
  },
  {
    id: "machine-002",
    name: "Development VM",
    status: "idle",
    ipAddress: "192.168.1.101",
    lastSeen: new Date(Date.now() - 35 * 60000).toISOString(),
    description: "Development environment for testing new workflows",
    processCount: 3,
    cpuUsage: 12,
    memoryUsage: 48
  },
  {
    id: "machine-003",
    name: "Data Processing",
    status: "active",
    ipAddress: "192.168.1.102",
    lastSeen: new Date(Date.now() - 2 * 60000).toISOString(),
    description: "Dedicated to ETL and data transformation workflows",
    processCount: 5,
    cpuUsage: 78,
    memoryUsage: 82
  },
  {
    id: "machine-004",
    name: "Reporting Server",
    status: "error",
    ipAddress: "192.168.1.103",
    lastSeen: new Date(Date.now() - 240 * 60000).toISOString(),
    description: "Generates automated reports and dashboards",
    processCount: 0,
    cpuUsage: 0,
    memoryUsage: 0
  },
  {
    id: "machine-005",
    name: "API Gateway",
    status: "active",
    ipAddress: "192.168.1.104",
    lastSeen: new Date(Date.now() - 1 * 60000).toISOString(),
    description: "Manages API requests and integrations",
    processCount: 12,
    cpuUsage: 56,
    memoryUsage: 72
  }
];

// Mock Processes Data
export const processes: Process[] = [
  {
    id: "process-001",
    name: "Daily Data Sync",
    status: "running",
    machineId: "machine-001",
    startTime: new Date(Date.now() - 45 * 60000).toISOString(),
    description: "Synchronizes data between production and warehouse",
    type: "Data Sync"
  },
  {
    id: "process-002",
    name: "Customer Report Generation",
    status: "completed",
    machineId: "machine-001",
    startTime: new Date(Date.now() - 120 * 60000).toISOString(),
    endTime: new Date(Date.now() - 90 * 60000).toISOString(),
    duration: "30m",
    description: "Generates monthly customer activity reports",
    type: "Reporting"
  },
  {
    id: "process-003",
    name: "Log Cleanup",
    status: "pending",
    machineId: "machine-002",
    startTime: new Date(Date.now() + 60 * 60000).toISOString(),
    description: "Cleans up old log files on development system",
    type: "Maintenance"
  },
  {
    id: "process-004",
    name: "Database Backup",
    status: "failed",
    machineId: "machine-003",
    startTime: new Date(Date.now() - 180 * 60000).toISOString(),
    endTime: new Date(Date.now() - 175 * 60000).toISOString(),
    duration: "5m",
    description: "Daily database backup process",
    type: "Backup"
  },
  {
    id: "process-005",
    name: "API Health Check",
    status: "completed",
    machineId: "machine-005",
    startTime: new Date(Date.now() - 240 * 60000).toISOString(),
    endTime: new Date(Date.now() - 239 * 60000).toISOString(),
    duration: "1m",
    description: "Periodic check of API endpoints",
    type: "Monitoring"
  },
  {
    id: "process-006",
    name: "User Analytics",
    status: "running",
    machineId: "machine-001",
    startTime: new Date(Date.now() - 30 * 60000).toISOString(),
    description: "Processes user activity data for analytics",
    type: "Analytics"
  },
  {
    id: "process-007",
    name: "System Update",
    status: "stopped",
    machineId: "machine-002",
    startTime: new Date(Date.now() - 300 * 60000).toISOString(),
    endTime: new Date(Date.now() - 290 * 60000).toISOString(),
    duration: "10m",
    description: "Scheduled system updates and patches",
    type: "Maintenance"
  },
  {
    id: "process-008",
    name: "Email Campaign",
    status: "pending",
    machineId: "machine-005",
    startTime: new Date(Date.now() + 120 * 60000).toISOString(),
    description: "Sends promotional email campaign",
    type: "Marketing"
  }
];

// Mock Agents Data
export const agents: Agent[] = [
  {
    id: "agent-001",
    name: "DataSyncAgent",
    status: "active",
    version: "1.2.3",
    type: "Data Sync",
    machineIds: ["machine-001"],
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Handles data synchronization between systems",
    configuration: {
      syncInterval: "30m",
      retryAttempts: 3,
      sources: ["CRM", "ERP"]
    }
  },
  {
    id: "agent-002",
    name: "LogMonitorAgent",
    status: "active",
    version: "2.0.1",
    type: "Monitoring",
    machineIds: ["machine-003"],
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Monitors and analyzes system logs",
    configuration: {
      alertThreshold: "error",
      scanFrequency: "5m",
      retentionDays: 30
    }
  },
  {
    id: "agent-003",
    name: "ReportGenerator",
    status: "inactive",
    version: "1.0.5",
    type: "Reporting",
    machineIds: ["machine-002"],
    lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Generates scheduled reports",
    configuration: {
      format: "PDF",
      schedule: "daily",
      recipients: ["admin@example.com"]
    }
  },
  {
    id: "agent-004",
    name: "BackupAgent",
    status: "error",
    version: "3.1.2",
    type: "Backup",
    machineIds: ["machine-004"],
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Manages automated backups",
    configuration: {
      backupTime: "02:00",
      compressionLevel: "high",
      destination: "s3://backups"
    }
  },
  {
    id: "agent-005",
    name: "ApiIntegrationAgent",
    status: "updating",
    version: "1.1.7",
    type: "Integration",
    machineIds: ["machine-005"],
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Manages third-party API integrations",
    configuration: {
      rateLimit: 100,
      timeout: "30s",
      authMethod: "OAuth2"
    }
  }
];

// Helper functions for agents
export const getAgents = () => agents;
export const getAgentById = (id: string) => agents.find(agent => agent.id === id);
export const getAgentsByMachineId = (machineId: string) => agents.filter(agent => agent.machineIds.includes(machineId));
export const getAgentsByType = (type: string) => agents.filter(agent => agent.type === type);

// Get counts of agents by type
export const getAgentTypeCounts = (): AgentTypeCount[] => {
  const typeCounts: Record<string, number> = {};
  
  agents.forEach(agent => {
    if (typeCounts[agent.type]) {
      typeCounts[agent.type]++;
    } else {
      typeCounts[agent.type] = 1;
    }
  });
  
  return Object.entries(typeCounts).map(([type, count]) => ({
    type,
    count
  }));
};

// Add a new agent
export const addAgent = (agentData: NewAgentForm) => {
  const newAgent: Agent = {
    id: `agent-${Date.now()}`,
    name: agentData.name,
    status: 'inactive',
    version: '1.0.0',
    type: agentData.type,
    machineIds: agentData.machineIds,
    lastUpdated: new Date().toISOString(),
    description: agentData.description,
    configuration: agentData.configuration
  };
  
  agents.push(newAgent);
  return newAgent;
};

// Helper functions to get data
export const getMachines = () => machines;
export const getMachineById = (id: string) => machines.find(machine => machine.id === id);
export const getProcesses = () => processes;
export const getProcessesByMachineId = (machineId: string) => processes.filter(process => process.machineId === machineId);
export const getProcessById = (id: string) => processes.find(process => process.id === id);

// Function to add a new machine
export const addMachine = (machineData: NewMachineForm) => {
  const newMachine: Machine = {
    id: `machine-${Date.now()}`,
    name: machineData.name,
    status: machineData.status,
    ipAddress: machineData.ipAddress,
    lastSeen: new Date().toISOString(),
    description: machineData.description,
    processCount: 0,
    cpuUsage: 0,
    memoryUsage: 0
  };
  
  machines.push(newMachine);
  return newMachine;
};

// Function to add a new process
export const addProcess = (processData: NewProcessForm) => {
  const newProcess: Process = {
    id: `process-${Date.now()}`,
    name: processData.name,
    status: 'pending',
    machineId: processData.machineId,
    startTime: new Date(Date.now() + 60000).toISOString(), // Scheduled to start in 1 minute
    description: processData.description,
    type: processData.type
  };
  
  processes.push(newProcess);
  
  // Update machine process count
  const machine = getMachineById(processData.machineId);
  if (machine) {
    machine.processCount += 1;
  }
  
  return newProcess;
};

// Function to assign process to machine and run it
export const assignAndRunProcess = (assignmentData: ProcessAssignmentForm) => {
  const process = getProcessById(assignmentData.processId);
  const machine = getMachineById(assignmentData.machineId);
  
  if (!process || !machine) {
    return {
      success: false,
      message: "Process or machine not found"
    };
  }
  
  // Update the process machine and status
  process.machineId = assignmentData.machineId;
  process.status = 'running';
  process.startTime = new Date().toISOString();
  
  // Update the machine process count and status if needed
  if (machine.status === 'idle') {
    machine.status = 'active';
  }
  machine.processCount += 1;
  
  return {
    success: true,
    message: `Process ${process.name} assigned to ${machine.name} and started running`,
    process
  };
};

// Function to simulate API execution
export const executeProcessApi = (processId: string, parameters: Record<string, any> = {}) => {
  // In a real application, this would make an actual API call
  const process = getProcessById(processId);
  
  if (!process) {
    return {
      executionId: "",
      status: "failed" as const,
      message: "Process not found"
    };
  }
  
  return {
    executionId: `exec-${Date.now()}`,
    status: "queued" as const,
    message: `Process ${process.name} queued for execution with parameters: ${JSON.stringify(parameters)}`
  };
};

// New helper functions for multi-machine support
export const getMachinesByIds = (machineIds: string[]): Machine[] => {
  return machines.filter(machine => machineIds.includes(machine.id));
};

export const getProcessesByMachineIds = (machineIds: string[]): Process[] => {
  return processes.filter(process => machineIds.includes(process.machineId));
};
