
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProcessById, getMachineById, executeProcessApi } from "@/lib/mock-data";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Play,
  Pause,
  RefreshCw,
  HelpCircle,
  Terminal,
  CheckCircle,
  XCircle,
  Workflow,
  BarChart,
  ScrollText,
  History,
  Server
} from "lucide-react";
import ProcessStatusChart from "@/components/charts/ProcessStatusChart";
import ProcessLogsList from "@/components/process/ProcessLogsList";
import NotFound from "./NotFound";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProcessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [apiParams, setApiParams] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get process and its machine
  const process = id ? getProcessById(id) : null;
  const machine = process ? getMachineById(process.machineId) : null;

  // If process not found, show 404
  if (!process) {
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
        description: "Process data has been updated",
      });
    }, 1000);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "running": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "failed": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "stopped": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "running": return <Play className="h-4 w-4 mr-1" />;
      case "completed": return <CheckCircle className="h-4 w-4 mr-1" />;
      case "failed": return <XCircle className="h-4 w-4 mr-1" />;
      case "pending": return <Clock className="h-4 w-4 mr-1" />;
      case "stopped": return <Pause className="h-4 w-4 mr-1" />;
      default: return null;
    }
  };
  
  // Handle API execution
  const handleExecuteAPI = () => {
    try {
      // Parse parameters if provided
      const params = apiParams ? JSON.parse(apiParams) : {};
      
      // Execute the API
      const result = executeProcessApi(process.id, params);
      
      if (result.status === "queued") {
        toast({
          title: "Process Execution Queued",
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

  // Handle start process
  const handleStart = () => {
    toast({
      title: "Process Started",
      description: `Process ${process.name} has been started`,
    });
  };

  // Handle stop process
  const handleStop = () => {
    toast({
      title: "Process Stopped",
      description: `Process ${process.name} has been stopped`,
    });
  };

  // Handle restart process
  const handleRestart = () => {
    toast({
      title: "Process Restarted",
      description: `Process ${process.name} has been restarted`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex flex-col space-y-2">
          <Link 
            to="/processes" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Processes
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Workflow className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{process.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">{process.type}</Badge>
                  <Badge className={getStatusColor(process.status)}>
                    {getStatusIcon(process.status)}
                    {process.status.charAt(0).toUpperCase() + process.status.slice(1)}
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
          <p>{process.description}</p>
        </div>

        {/* Process info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                Start Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{formatDate(process.startTime)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                {process.endTime ? "End Time" : "Duration"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {process.endTime ? formatDate(process.endTime) : (process.duration || "Running...")}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Server className="mr-2 h-4 w-4 text-gray-500" />
                Assigned Machine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {machine ? (
                  <Link 
                    to={`/machines/${machine.id}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {machine.name}
                  </Link>
                ) : "Not assigned"}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Process Actions */}
        <div className="flex flex-wrap gap-2">
          {(process.status === "pending" || process.status === "stopped") && (
            <Button 
              variant="default" 
              onClick={handleStart}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Process
            </Button>
          )}
          
          {process.status === "running" && (
            <Button 
              variant="default" 
              onClick={handleStop}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              <Pause className="mr-2 h-4 w-4" />
              Stop Process
            </Button>
          )}
          
          {["completed", "failed", "stopped"].includes(process.status) && (
            <Button 
              variant="default" 
              onClick={handleRestart}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Restart Process
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => setDialogOpen(true)}
          >
            <Terminal className="mr-2 h-4 w-4" />
            Execute API
          </Button>
        </div>
        
        <Separator />
        
        {/* Tabs for different views */}
        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status" className="flex items-center">
              <BarChart className="h-4 w-4 mr-2" />
              Status
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center">
              <ScrollText className="h-4 w-4 mr-2" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="pt-6">
            <ProcessStatusChart processId={process.id} />
          </TabsContent>
          
          <TabsContent value="logs" className="pt-6">
            <ProcessLogsList processId={process.id} />
          </TabsContent>
          
          <TabsContent value="history" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Process History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  This section will show the execution history of this process.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* API Execution Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Execute Process via API</DialogTitle>
              <DialogDescription>
                Execute <span className="font-medium">{process.name}</span> with these parameters:
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
      </div>
    </Layout>
  );
}
