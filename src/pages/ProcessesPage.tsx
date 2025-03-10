
import { useState } from "react";
import { getProcesses, getMachines } from "@/lib/mock-data";
import { Process } from "@/types/orchestrator";
import { 
  Calendar,
  CheckCircle, 
  Clock, 
  Play, 
  Search, 
  XCircle,
  RefreshCw,
  FileText,
  Pause,
  SkipForward
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

const ProcessesPage = () => {
  const { toast } = useToast();
  const allProcesses = getProcesses();
  const machines = getMachines();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [machineFilter, setMachineFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Process actions
  const handleStart = (processId: string) => {
    toast({
      title: "Process Started",
      description: `Process ${processId} has been started successfully`,
    });
  };

  const handleStop = (processId: string) => {
    toast({
      title: "Process Stopped",
      description: `Process ${processId} has been stopped`,
    });
  };

  const handleSkip = (processId: string) => {
    toast({
      title: "Task Skipped",
      description: `Current task in process ${processId} has been skipped`,
    });
  };

  // Filter processes by search query, status and machine
  const filteredProcesses = allProcesses.filter(process => {
    const matchesSearch = 
      process.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      process.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      process.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || process.status === statusFilter;
    const matchesMachine = machineFilter === "all" || process.machineId === machineFilter;
    
    return matchesSearch && matchesStatus && matchesMachine;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Processes</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage and monitor your automation processes
            </p>
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="self-start"
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search processes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={machineFilter}
            onValueChange={setMachineFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by machine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Machines</SelectItem>
              {machines.map(machine => (
                <SelectItem key={machine.id} value={machine.id}>
                  {machine.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Processes Table */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Process Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Machine</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProcesses.length > 0 ? (
                filteredProcesses.map((process) => (
                  <ProcessRow 
                    key={process.id} 
                    process={process}
                    machines={machines}
                    onStart={() => handleStart(process.id)}
                    onStop={() => handleStop(process.id)}
                    onSkip={() => handleSkip(process.id)}
                    formatDate={formatDate}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <h3 className="mt-2 text-base font-medium">No processes found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

interface ProcessRowProps {
  process: Process;
  machines: any[];
  onStart: () => void;
  onStop: () => void;
  onSkip: () => void;
  formatDate: (date: string) => string;
}

const ProcessRow = ({ process, machines, onStart, onStop, onSkip, formatDate }: ProcessRowProps) => {
  const machine = machines.find(m => m.id === process.machineId);
  
  // Get status badge classes
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "running":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 flex items-center";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center";
      case "stopped":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 flex items-center";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 flex items-center";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "running":
        return <Play className="h-3 w-3 mr-1 animate-pulse" />;
      case "completed":
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case "failed":
        return <XCircle className="h-3 w-3 mr-1" />;
      case "pending":
        return <Clock className="h-3 w-3 mr-1" />;
      case "stopped":
        return <Pause className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  // Calculate duration if process is completed
  const getDuration = () => {
    if (process.duration) {
      return process.duration;
    }
    
    if (process.status === "running") {
      return "Running...";
    }
    
    return "-";
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div>
          {process.name}
          <div className="text-xs text-gray-500 mt-1">{process.type}</div>
        </div>
      </TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${getStatusBadge(process.status)}`}>
          {getStatusIcon(process.status)}
          {process.status.charAt(0).toUpperCase() + process.status.slice(1)}
        </span>
      </TableCell>
      <TableCell>{machine?.name || "Unknown"}</TableCell>
      <TableCell>
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1 text-gray-500" />
          {formatDate(process.startTime)}
        </div>
      </TableCell>
      <TableCell>{getDuration()}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          {(process.status === "pending" || process.status === "stopped") && (
            <Button size="sm" variant="outline" onClick={onStart}>
              <Play className="h-4 w-4" />
            </Button>
          )}
          
          {process.status === "running" && (
            <>
              <Button size="sm" variant="outline" onClick={onStop}>
                <Pause className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={onSkip}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {["completed", "failed"].includes(process.status) && (
            <Button size="sm" variant="outline" onClick={onStart}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProcessesPage;
