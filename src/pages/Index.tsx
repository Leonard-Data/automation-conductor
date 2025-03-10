
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMachines, getProcesses } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { 
  Activity, 
  Laptop, 
  Play, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const machines = getMachines();
  const processes = getProcesses();
  
  // Calculate statistics
  const activeMachines = machines.filter(m => m.status === "active").length;
  const errorMachines = machines.filter(m => m.status === "error").length;
  
  const runningProcesses = processes.filter(p => p.status === "running").length;
  const completedProcesses = processes.filter(p => p.status === "completed").length;
  const failedProcesses = processes.filter(p => p.status === "failed").length;
  const pendingProcesses = processes.filter(p => p.status === "pending").length;

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Overview of your automation orchestration environment
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Machines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Laptop className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold">{machines.length}</span>
                </div>
                <div className="text-sm text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <span className="text-status-active">{activeMachines} active</span>
                    <div className="w-2 h-2 rounded-full bg-status-active"></div>
                  </div>
                  {errorMachines > 0 && (
                    <div className="flex items-center justify-end space-x-1">
                      <span className="text-status-error">{errorMachines} errors</span>
                      <div className="w-2 h-2 rounded-full bg-status-error"></div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Processes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Play className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold">{processes.length}</span>
                </div>
                <div className="text-sm text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <span className="text-status-active">{runningProcesses} running</span>
                    <div className="w-2 h-2 rounded-full bg-status-active animate-pulse-slow"></div>
                  </div>
                  {failedProcesses > 0 && (
                    <div className="flex items-center justify-end space-x-1">
                      <span className="text-status-error">{failedProcesses} failed</span>
                      <div className="w-2 h-2 rounded-full bg-status-error"></div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Process Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Play className="h-4 w-4 text-status-active" />
                    <span>Running</span>
                  </div>
                  <span className="font-medium">{runningProcesses}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-status-active" />
                    <span>Completed</span>
                  </div>
                  <span className="font-medium">{completedProcesses}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-status-pending" />
                    <span>Pending</span>
                  </div>
                  <span className="font-medium">{pendingProcesses}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-status-error" />
                    <span>Failed</span>
                  </div>
                  <span className="font-medium">{failedProcesses}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">CPU Usage</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Memory Usage</span>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Storage</span>
                    <span className="text-sm font-medium">23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Processes</CardTitle>
                <Link to="/processes" className="text-sm text-blue-500 hover:underline">
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processes.slice(0, 5).map(process => (
                  <div key={process.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <div className="font-medium">{process.name}</div>
                      <div className="text-sm text-gray-500">{process.type}</div>
                    </div>
                    <div className="flex items-center">
                      {process.status === "running" && (
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 flex items-center">
                          <Activity className="h-3 w-3 mr-1 animate-pulse" />
                          Running
                        </span>
                      )}
                      {process.status === "completed" && (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </span>
                      )}
                      {process.status === "failed" && (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Failed
                        </span>
                      )}
                      {process.status === "pending" && (
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Machine Status</CardTitle>
                <Link to="/machines" className="text-sm text-blue-500 hover:underline">
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {machines.slice(0, 5).map(machine => (
                  <div key={machine.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <div className="font-medium">{machine.name}</div>
                      <div className="text-sm text-gray-500">{machine.ipAddress}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-gray-500">
                        {machine.processCount} processes
                      </div>
                      <div>
                        {machine.status === "active" && (
                          <div className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                            Active
                          </div>
                        )}
                        {machine.status === "idle" && (
                          <div className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 flex items-center">
                            <div className="h-2 w-2 rounded-full bg-gray-500 mr-1"></div>
                            Idle
                          </div>
                        )}
                        {machine.status === "error" && (
                          <div className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center">
                            <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
                            Error
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
