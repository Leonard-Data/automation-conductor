
import { useState } from "react";
import { Link } from "react-router-dom";
import { getMachines } from "@/lib/mock-data";
import { Machine } from "@/types/orchestrator";
import { 
  Laptop, 
  Search, 
  Server, 
  Activity,
  RefreshCw,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

const MachinesPage = () => {
  const { toast } = useToast();
  const allMachines = getMachines();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Filter machines by search query and status
  const filteredMachines = allMachines.filter(machine => {
    const matchesSearch = 
      machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || machine.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Machines</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage your automation machines and their status
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
              placeholder="Search machines..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Machines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMachines.length > 0 ? (
            filteredMachines.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Server className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No machines found</h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

// Machine Card Component
const MachineCard = ({ machine }: { machine: Machine }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-status-active bg-green-100 dark:bg-green-900 dark:text-green-300";
      case "idle": return "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300";
      case "error": return "text-status-error bg-red-100 dark:bg-red-900 dark:text-red-300";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  // Format the last seen time
  const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <Laptop className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium text-lg">{machine.name}</h3>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs flex items-center ${getStatusColor(machine.status)}`}>
              {machine.status === "active" && <div className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>}
              {machine.status === "idle" && <div className="h-2 w-2 rounded-full bg-gray-500 mr-1"></div>}
              {machine.status === "error" && <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>}
              {machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">IP Address:</span>
              <span className="font-mono">{machine.ipAddress}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Last Seen:</span>
              <span>{formatLastSeen(machine.lastSeen)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Processes:</span>
              <span>{machine.processCount}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
            {machine.description}
          </p>
          
          {machine.status !== "error" && (
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>CPU</span>
                  <span>{machine.cpuUsage}%</span>
                </div>
                <Progress value={machine.cpuUsage} className="h-1" />
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Memory</span>
                  <span>{machine.memoryUsage}%</span>
                </div>
                <Progress value={machine.memoryUsage} className="h-1" />
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t">
          <Link
            to={`/machines/${machine.id}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Activity className="mr-1 h-4 w-4" />
            View Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default MachinesPage;
