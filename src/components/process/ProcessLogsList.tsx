
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, AlertTriangle, CheckCircle, Info, Clock } from "lucide-react";

interface Log {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
}

// Mock logs data - in a real app, fetch this from API
const generateMockLogs = (processId: string, count: number = 50): Log[] => {
  const now = new Date();
  const logs: Log[] = [];
  const levels: ('info' | 'warning' | 'error' | 'debug')[] = ['info', 'warning', 'error', 'debug'];
  const messages = [
    "Process started",
    "Connecting to database",
    "Database connection established",
    "Fetching data from API",
    "API response received",
    "Processing data batch",
    "Data transformation complete",
    "File upload started",
    "File upload complete",
    "Connection timeout, retrying",
    "Database query failed",
    "Permission denied",
    "Insufficient memory",
    "Validation error in input data",
    "Process completed successfully",
    "Process terminated with errors"
  ];
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - i * 60000 * Math.random() * 5);
    const level = levels[Math.floor(Math.random() * levels.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    logs.push({
      id: `log-${processId}-${i}`,
      timestamp: timestamp.toISOString(),
      level,
      message
    });
  }
  
  // Sort logs by timestamp (newest first)
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

interface ProcessLogsListProps {
  processId: string;
}

export default function ProcessLogsList({ processId }: ProcessLogsListProps) {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<Log[]>([]);
  const [filter, setFilter] = useState<string>('all');
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLogs(generateMockLogs(processId));
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [processId]);
  
  // Filter logs
  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.level === filter);
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Get log level badge
  const getLevelBadge = (level: string) => {
    switch(level) {
      case 'info':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <Info className="h-3 w-3 mr-1" />
            INFO
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            WARNING
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            ERROR
          </Badge>
        );
      case 'debug':
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            <Terminal className="h-3 w-3 mr-1" />
            DEBUG
          </Badge>
        );
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge 
          className={`cursor-pointer ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
          onClick={() => setFilter('all')}
        >
          All Logs
        </Badge>
        <Badge 
          className={`cursor-pointer ${filter === 'info' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}
          onClick={() => setFilter('info')}
        >
          <Info className="h-3 w-3 mr-1" />
          Info
        </Badge>
        <Badge 
          className={`cursor-pointer ${filter === 'warning' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-800'}`}
          onClick={() => setFilter('warning')}
        >
          <AlertTriangle className="h-3 w-3 mr-1" />
          Warning
        </Badge>
        <Badge 
          className={`cursor-pointer ${filter === 'error' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'}`}
          onClick={() => setFilter('error')}
        >
          <AlertTriangle className="h-3 w-3 mr-1" />
          Error
        </Badge>
        <Badge 
          className={`cursor-pointer ${filter === 'debug' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800'}`}
          onClick={() => setFilter('debug')}
        >
          <Terminal className="h-3 w-3 mr-1" />
          Debug
        </Badge>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Process Logs</span>
            <Badge variant="outline">
              {filteredLogs.length} entries
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLogs.length > 0 ? (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div 
                    key={log.id}
                    className="p-3 border rounded-md bg-gray-50 dark:bg-gray-900"
                  >
                    <div className="flex justify-between mb-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimestamp(log.timestamp)}
                      </div>
                      {getLevelBadge(log.level)}
                    </div>
                    <div className="font-mono text-sm">
                      {log.message}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8">
              <Terminal className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p>No logs match the current filter</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
