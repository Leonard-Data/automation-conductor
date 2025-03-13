
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Plus, 
  Filter, 
  Search,
  Server
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAgents, getAgentTypeCounts } from '@/lib/mock-data';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#4ade80', '#60a5fa', '#f87171', '#fbbf24', '#a78bfa'];

const AgentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: getAgents
  });
  
  const { data: agentTypeCounts = [] } = useQuery({
    queryKey: ['agentTypeCounts'],
    queryFn: getAgentTypeCounts
  });
  
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-status-active';
      case 'inactive': return 'bg-status-idle';
      case 'error': return 'bg-status-error';
      case 'updating': return 'bg-status-pending';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Agents</h1>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button asChild>
              <Link to="/agents/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Agent
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">Agent List</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgents.map(agent => (
                <Card key={agent.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{agent.name}</CardTitle>
                        <CardDescription className="line-clamp-1">{agent.description}</CardDescription>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`${getStatusColor(agent.status)} h-2.5 w-2.5 rounded-full animate-pulse-slow`}></span>
                        <span className="text-sm capitalize">{agent.status}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-2">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Type:</span>
                        <Badge variant="outline">{agent.type}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Version:</span>
                        <span className="text-sm font-medium">{agent.version}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Machine:</span>
                        <div className="flex items-center gap-1">
                          <Server className="h-3.5 w-3.5 text-muted-foreground" />
                          <Link to={`/machines/${agent.machineId}`} className="text-sm text-primary hover:underline">
                            View Machine
                          </Link>
                        </div>
                      </div>
                      
                      <Button variant="outline" asChild className="mt-2 w-full">
                        <Link to={`/agents/${agent.id}`}>
                          View Agent Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredAgents.length === 0 && (
              <div className="text-center p-8">
                <p className="text-muted-foreground">No agents found. Try adjusting your search.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agents by Type</CardTitle>
                  <CardDescription>Distribution of agents by their type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={agentTypeCounts}
                          dataKey="count"
                          nameKey="type"
                          cx="50%"
                          cy="50%"
                          outerRadius={130}
                          label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {agentTypeCounts.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} agents`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Agent Status Overview</CardTitle>
                  <CardDescription>Current status of all agents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {['active', 'inactive', 'updating', 'error'].map(status => {
                      const count = agents.filter(agent => agent.status === status).length;
                      return (
                        <Card key={status} className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground capitalize">{status}</p>
                                <p className="text-2xl font-bold">{count}</p>
                              </div>
                              <div className={`${getStatusColor(status)} h-12 w-12 rounded-full flex items-center justify-center`}>
                                <span className="text-white text-lg font-bold">{Math.round((count / agents.length) * 100)}%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AgentsPage;
