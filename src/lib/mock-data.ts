
import { Machine, Process } from "@/types/orchestrator";

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

// Helper functions to get data
export const getMachines = () => machines;
export const getMachineById = (id: string) => machines.find(machine => machine.id === id);
export const getProcesses = () => processes;
export const getProcessesByMachineId = (machineId: string) => processes.filter(process => process.machineId === machineId);
export const getProcessById = (id: string) => processes.find(process => process.id === id);

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
