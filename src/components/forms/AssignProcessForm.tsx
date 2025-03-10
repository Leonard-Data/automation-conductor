
import { useState, useEffect } from "react";
import { getMachines, getProcesses, assignAndRunProcess } from "@/lib/mock-data";
import { Machine, Process, ProcessAssignmentForm } from "@/types/orchestrator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, Play } from "lucide-react";

export default function AssignProcessForm() {
  const { toast } = useToast();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [availableProcesses, setAvailableProcesses] = useState<Process[]>([]);
  const [formData, setFormData] = useState<ProcessAssignmentForm>({
    processId: "",
    machineId: "",
    parameters: {}
  });
  const [paramsJson, setParamsJson] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get all available machines that are not offline or in error state
    const activeMachines = getMachines().filter(m => m.status !== 'offline' && m.status !== 'error');
    setMachines(activeMachines);
    
    // Get all processes that are not running
    const nonRunningProcesses = getProcesses().filter(p => p.status !== 'running');
    setAvailableProcesses(nonRunningProcesses);
    
    // Set defaults if available
    if (activeMachines.length > 0) {
      setFormData(prev => ({ ...prev, machineId: activeMachines[0].id }));
    }
    
    if (nonRunningProcesses.length > 0) {
      setFormData(prev => ({ ...prev, processId: nonRunningProcesses[0].id }));
    }
  }, []);

  const handleProcessChange = (value: string) => {
    setFormData(prev => ({ ...prev, processId: value }));
  };

  const handleMachineChange = (value: string) => {
    setFormData(prev => ({ ...prev, machineId: value }));
  };

  const handleParamsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setParamsJson(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Parse parameters if provided
      if (paramsJson.trim()) {
        try {
          const params = JSON.parse(paramsJson);
          formData.parameters = params;
        } catch (error) {
          toast({
            title: "Invalid JSON",
            description: "Please provide valid JSON for parameters or leave empty",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      // Assign and run the process
      const result = assignAndRunProcess(formData);
      
      if (result.success) {
        toast({
          title: "Process Assigned",
          description: result.message,
        });
        
        // Clear form
        setParamsJson("");
        
        // Refresh available processes
        const updatedProcesses = getProcesses().filter(p => p.status !== 'running');
        setAvailableProcesses(updatedProcesses);
      } else {
        toast({
          title: "Assignment Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="processId">Select Process</Label>
        {availableProcesses.length > 0 ? (
          <Select
            value={formData.processId}
            onValueChange={handleProcessChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select process" />
            </SelectTrigger>
            <SelectContent>
              {availableProcesses.map((process) => (
                <SelectItem key={process.id} value={process.id}>
                  {process.name} ({process.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="text-sm text-amber-600 p-2 bg-amber-50 rounded">
            No available processes. All processes are currently running or you need to add new ones.
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="machineId">Assign to Machine</Label>
        {machines.length > 0 ? (
          <Select
            value={formData.machineId}
            onValueChange={handleMachineChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select machine" />
            </SelectTrigger>
            <SelectContent>
              {machines.map((machine) => (
                <SelectItem key={machine.id} value={machine.id}>
                  {machine.name} ({machine.ipAddress})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="text-sm text-red-500 p-2 bg-red-50 rounded">
            No available machines. Please add a machine first.
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="parameters">Parameters (JSON)</Label>
        <Textarea
          id="parameters"
          value={paramsJson}
          onChange={handleParamsChange}
          placeholder='{"param1": "value1", "param2": "value2"}'
          className="font-mono text-sm"
          rows={5}
        />
        <p className="text-xs text-gray-500 flex items-start">
          <HelpCircle className="h-3 w-3 mr-1 mt-0.5" />
          Enter parameters as a valid JSON object or leave empty
        </p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || machines.length === 0 || availableProcesses.length === 0}
      >
        <Play className="mr-2 h-4 w-4" />
        {isLoading ? "Assigning..." : "Assign and Run Process"}
      </Button>
    </form>
  );
}
