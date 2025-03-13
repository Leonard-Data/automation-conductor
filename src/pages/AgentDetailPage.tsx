
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAgentById, getProcessesByMachineId, getMachineById } from '@/lib/mock-data';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, User, Server, Clock, Settings, RotateCw } from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ConfigCardProps {
  title: string;
  value: string | number;
}

const ConfigCard = ({ title, value }: ConfigCardProps) => (
  <Card>
    <CardContent className="p-6">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-lg font-bold mt-1">{value}</p>
    </CardContent>
  </Card>
);

// Mock data for agent metrics - in a real app, fetch from API
const generateMetricsData = () => {
  const now = new Date();
  const data = [];
  
  for (let i = 14; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: format(date, 'MMM dd'),
      executions: Math.floor(Math.random() * 15) + 5,
      errors: Math.floor(Math.random() * 3),
    });
  }
  
  return data;
};

const AgentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const agentId = id || '';
  
  const { data: agent, isLoading } = useQuery({
    queryKey: ['agent', agentId],
    queryFn: () => getAgentById(agentId),
    enabled: !!agentId,
  });
  
  const { data: machine } = useQuery({
    queryKey: ['machine', agent?.machineId],
    queryFn: () => getMachineById(agent?.machineId || ''),
    enabled: !!agent?.machineId,
  });
  
  const { data: processes } = useQuery({
    queryKey: ['processes', agent?.machineId],
    queryFn: () => getProcessesByMachineId(agent?.machineId || ''),
    enabled: !!agent?.machineId,
  });
  
  const metricsData = generateMetricsData();
  
  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
      </Layout>
    );
  }
  
  if (!agent) {
    return (
      <Layout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold">Agent not found</h2>
          <p className="text-muted-foreground mt-2">The agent you're looking for does not exist or has been removed.</p>
          <Button asChild className="mt-6">
            <Link to="/agents">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Agents
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-status-active';
      case 'inactive': return 'bg-status-idle';
      case 'error': return 'bg-status-error';
      case 'updating': return 'bg-status-pending';
      default: return 'bg-gray-500';
    }
  };
  
  const statusColor = getStatusColor(agent.status);
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/agents">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">{agent.name}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`${statusColor} h-2.5 w-2.5 rounded-full animate-pulse-slow`}></span>
              <span className="capitalize">{agent.status}</span>
            </div>
            <Button variant="outline">
              <RotateCw className="mr-2 h-4 w-4" />
              Restart Agent
            </Button>
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{agent.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Version</p>
                  <p className="font-medium">{agent.version}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {format(new Date(agent.lastUpdated), 'PPP')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{agent.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Machine</CardTitle>
            </CardHeader>
            <CardContent>
              {machine ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{machine.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2">
                      <span className={`${getStatusColor(machine.status)} h-2.5 w-2.5 rounded-full`}></span>
                      <span className="capitalize">{machine.status}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">IP Address</p>
                    <p className="font-medium">{machine.ipAddress}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Machine not found</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {machine && (
                <Button variant="outline" asChild className="w-full">
                  <Link to={`/machines/${machine.id}`}>
                    <Server className="mr-2 h-4 w-4" />
                    View Machine
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Processes</CardTitle>
            </CardHeader>
            <CardContent>
              {processes && processes.length > 0 ? (
                <div className="space-y-3">
                  {processes.slice(0, 3).map(process => (
                    <div key={process.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{process.name}</p>
                        <p className="text-sm text-muted-foreground">{process.type}</p>
                      </div>
                      <Badge 
                        className={
                          process.status === 'running' ? 'bg-status-active' :
                          process.status === 'completed' ? 'bg-status-idle' :
                          process.status === 'failed' ? 'bg-status-error' :
                          'bg-status-pending'
                        }
                      >
                        {process.status}
                      </Badge>
                    </div>
                  ))}
                  {processes.length > 3 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{processes.length - 3} more processes
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No processes found</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to={`/processes/assign?agentId=${agent.id}`}>
                  <Clock className="mr-2 h-4 w-4" />
                  Schedule Process
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Tabs defaultValue="metrics">
          <TabsList>
            <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Execution Metrics</CardTitle>
                <CardDescription>Process executions and errors over the last 15 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="executions" stroke="#3b82f6" name="Executions" />
                      <Line type="monotone" dataKey="errors" stroke="#ef4444" name="Errors" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="configuration">
            <Card>
              <CardHeader>
                <CardTitle>Agent Configuration</CardTitle>
                <CardDescription>Current configuration settings for this agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(agent.configuration).map(([key, value]) => (
                    <ConfigCard key={key} title={key} value={value as string | number} />
                  ))}
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button variant="outline" className="mr-2">Reset to Default</Button>
                <Button>Update Configuration</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AgentDetailPage;
