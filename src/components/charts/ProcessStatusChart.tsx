
import { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Mock process status data - in a real app, fetch this from API
const generateMockData = (processId: string) => {
  const now = new Date();
  const data = [];
  
  // Generate 24 hours of data points
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours().toString().padStart(2, '0');
    
    data.push({
      time: `${hour}:00`,
      cpuUsage: Math.floor(Math.random() * 40) + 20,
      memoryUsage: Math.floor(Math.random() * 30) + 40,
      taskCount: Math.floor(Math.random() * 5) + 1,
    });
  }
  
  return data;
};

// Mock process completion stats - in a real app, fetch this from API
const generateCompletionStats = (processId: string) => {
  return [
    { name: 'Completed', value: Math.floor(Math.random() * 80) + 100 },
    { name: 'Failed', value: Math.floor(Math.random() * 20) + 10 },
    { name: 'Stopped', value: Math.floor(Math.random() * 15) + 5 },
  ];
};

const COLORS = ['#4ade80', '#f87171', '#94a3b8'];

interface ProcessStatusChartProps {
  processId: string;
}

export default function ProcessStatusChart({ processId }: ProcessStatusChartProps) {
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState<any[]>([]);
  const [completionData, setCompletionData] = useState<any[]>([]);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setUsageData(generateMockData(processId));
      setCompletionData(generateCompletionStats(processId));
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [processId]);
  
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="usage">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="usage">Resource Usage</TabsTrigger>
          <TabsTrigger value="completion">Completion Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Utilization</CardTitle>
              <CardDescription>
                CPU and memory usage over the last 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="cpuUsage" 
                      name="CPU (%)" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      stackId="1"
                      fillOpacity={0.5}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="memoryUsage" 
                      name="Memory (%)" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      stackId="2"
                      fillOpacity={0.5} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Task Execution</CardTitle>
              <CardDescription>
                Number of tasks executed per hour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="taskCount" 
                      name="Tasks" 
                      stroke="#ff8042" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completion" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Process Completion Status</CardTitle>
              <CardDescription>
                Historical completion statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-[400px] w-full max-w-md">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={130}
                      innerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} runs`, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
