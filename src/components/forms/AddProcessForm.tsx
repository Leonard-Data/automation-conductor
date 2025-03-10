
import { useState, useEffect } from "react";
import { addProcess, getMachines } from "@/lib/mock-data";
import { NewProcessForm, Machine } from "@/types/orchestrator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useNavigate } from "react-router-dom";

export default function AddProcessForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [formData, setFormData] = useState<NewProcessForm>({
    name: "",
    description: "",
    type: "",
    machineId: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get all available machines
    const availableMachines = getMachines().filter(m => m.status !== 'offline' && m.status !== 'error');
    setMachines(availableMachines);
    
    // Set default machine if available
    if (availableMachines.length > 0) {
      setFormData(prev => ({ ...prev, machineId: availableMachines[0].id }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMachineChange = (value: string) => {
    setFormData(prev => ({ ...prev, machineId: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate if machine is selected
      if (!formData.machineId) {
        toast({
          title: "Machine Required",
          description: "Please select a machine for this process",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Add the process
      const newProcess = addProcess(formData);
      
      toast({
        title: "Process Added",
        description: `${newProcess.name} has been successfully added`,
      });
      
      // Redirect to the processes page
      navigate("/processes");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Process Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Data Sync"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Process Type</Label>
        <Input
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          placeholder="Data Sync, Backup, Maintenance, etc."
        />
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Describe what this process does"
          rows={3}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading || machines.length === 0}>
        {isLoading ? "Adding..." : "Add Process"}
      </Button>
    </form>
  );
}
