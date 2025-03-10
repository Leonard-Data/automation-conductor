
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  getMachineById, 
  getProcessesByMachineId,
  executeProcessApi
} from "@/lib/mock-data";
import { Process } from "@/types/orchestrator";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Clock, 
  Cpu, 
  HardDrive,
  Play,
  HelpCircle,
  CheckCircle,
  XCircle,
  Terminal,
  Laptop,
  RefreshCw,
  Code,
  Workflow,
  Pause,
  SkipForward,
  Server,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import NotFound from "./NotFound";

const MachineDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [apiParams, setApiParams] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get machine and its processes
  const machine = id ? getMachineById(id) : null;
  const processes = id ? getProcessesByMachineId(id) : [];
  
  // If machine not found, show 404
  if (!machine) {
    return <NotFound />;
  }

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate a refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Refreshed",
        description: "Machine data has been updated",
      });
    }, 1000);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Handle API execution
  const handleExecuteAPI = () => {
    if (!selectedProcess) return;
    
    try {
      // Parse parameters if provided
      const params = apiParams ? JSON.parse(apiParams) : {};
      
      // Execute the API
      const result = executeProcessApi(selectedProcess.id, params);
      
      if (result.status === "queued") {
        toast({
          title: "Process Queued",
          description: result.message,
        });
      } else {
        toast({
          title: "Execution Failed",
          description: result.message,
          variant: "destructive",
        });
      }
      
      // Close dialog
      setDialogOpen(false);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON parameters",
        variant: "destructive",
      });
    }
  };

  // Open API execution dialog
  const openExecuteDialog = (process: Process) => {
    setSelectedProcess(process);
    setApiParams("");
    setDialogOpen(true);
  };

  // Process status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "idle": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "error": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "offline": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex flex-col space-y-2">
          <Link 
            to="/machines" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Machines
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Laptop className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{machine.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="font-mono text-xs">{machine.ipAddress}</Badge>
                  <Badge className={getStatusColor(machine.status)}>
                    {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Description */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p>{machine.description}</p>
        </div>
        
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Cpu className="mr-2 h-4 w-4 text-gray-500" />
                CPU Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{machine.cpuUsage}%</div>
              <Progress value={machine.cpuUsage} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <HardDrive className="mr-2 h-4 w-4 text-gray-500" />
                Memory Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{machine.memoryUsage}%</div>
              <Progress value={machine.memoryUsage} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                Last Seen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDate(machine.lastSeen)}</div>
            </CardContent>
          </Card>
        </div>
        
        <Separator />
        
        {/* Processes */}
        <div>
          <h2 className="text-xl font-bold mb-4">Processes</h2>
          
          <Tabs defaultValue="running">
            <TabsList className="mb-4">
              <TabsTrigger value="running">Running</TabsTrigger>
              <TabsTrigger value="all">All Processes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="running">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {processes.filter(p => p.status === "running").length > 0 ? (
                  processes
                    .filter(p => p.status === "running")
                    .map(process => (
                      <ProcessCard 
                        key={process.id} 
                        process={process} 
                        onExecute={() => openExecuteDialog(process)}
                      />
                    ))
                ) : (
                  <div className="col-span-full bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                    <Play className="mx-auto h-10 w-10 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No Running Processes</h3>
                    <p className="mt-2 text-gray-500">
                      This machine doesn't have any running processes at the moment.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {processes.length > 0 ? (
                  processes.map(process => (
                    <ProcessCard 
                      key={process.id} 
                      process={process} 
                      onExecute={() => openExecuteDialog(process)}
                    />
                  ))
                ) : (
                  <div className="col-span-full bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                    <Server className="mx-auto h-10 w-10 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No Processes</h3>
                    <p className="mt-2 text-gray-500">
                      This machine doesn't have any processes configured.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* API Execution Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Execute Process via API</DialogTitle>
            <DialogDescription>
              {selectedProcess && (
                <>Execute <span className="font-medium">{selectedProcess.name}</span> with these parameters:</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="api-params">Parameters (JSON)</Label>
              <Textarea
                id="api-params"
                placeholder='{"param1": "value1", "param2": "value2"}'
                value={apiParams}
                onChange={(e) => setApiParams(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-gray-500 flex items-start">
                <HelpCircle className="h-3 w-3 mr-1 mt-0.5" />
                Enter parameters as a valid JSON object or leave empty
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExecuteAPI}>
              <Terminal className="mr-2 h-4 w-4" />
              Execute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

// Process Card Component
const ProcessCard = ({ process, onExecute }: { process: Process, onExecute: () => void }) => {
  const { toast } = useToast();
  
  // Get status badge classes
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "running":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "stopped":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "running":
        return <Play className="h-4 w-4 mr-1" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "failed":
        return <XCircle className="h-4 w-4 mr-1" />;
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />;
      case "stopped":
        return <Pause className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Handle stop process
  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Process Stopped",
      description: `Process ${process.name} has been stopped`,
    });
  };

  // Handle skip task
  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Task Skipped",
      description: `Current task in process ${process.name} has been skipped`,
    });
  };

  // Handle restart process
  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Process Restarted",
      description: `Process ${process.name} has been restarted`,
    });
  };

  return (
    <Card className={process.status === "running" ? "border-blue-300 dark:border-blue-800" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start">
          <div>{process.name}</div>
          <Badge className={getStatusBadge(process.status)}>
            {getStatusIcon(process.status)}
            {process.status.charAt(0).toUpperCase() + process.status.slice(1)}
          </Badge>
        </CardTitle>
        <CardDescription>{process.type}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-gray-500">Started: </span>
            {formatDate(process.startTime)}
          </div>
          
          {process.endTime && (
            <div className="text-sm">
              <span className="text-gray-500">Ended: </span>
              {formatDate(process.endTime)}
            </div>
          )}
          
          {process.duration && (
            <div className="text-sm">
              <span className="text-gray-500">Duration: </span>
              {process.duration}
            </div>
          )}
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {process.description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExecute}
        >
          <Code className="mr-2 h-4 w-4" />
          Execute API
        </Button>
        
        <div className="flex space-x-2">
          {process.status === "running" && (
            <>
              <Button variant="outline" size="sm" onClick={handleStop}>
                <Pause className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleSkip}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {(process.status === "completed" || process.status === "failed" || process.status === "stopped") && (
            <Button variant="outline" size="sm" onClick={handleRestart}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MachineDetailPage;
