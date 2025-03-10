
import { useState } from "react";
import { addMachine } from "@/lib/mock-data";
import { NewMachineForm, MachineStatus } from "@/types/orchestrator";
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

export default function AddMachineForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NewMachineForm>({
    name: "",
    ipAddress: "",
    description: "",
    status: "idle"
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as MachineStatus }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate IP address format
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(formData.ipAddress)) {
        toast({
          title: "Invalid IP Address",
          description: "Please enter a valid IPv4 address",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Add the machine
      const newMachine = addMachine(formData);
      
      toast({
        title: "Machine Added",
        description: `${newMachine.name} has been successfully added`,
      });
      
      // Redirect to the machines page
      navigate("/machines");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add machine. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Machine Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Production Server"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ipAddress">IP Address</Label>
        <Input
          id="ipAddress"
          name="ipAddress"
          value={formData.ipAddress}
          onChange={handleChange}
          required
          placeholder="192.168.1.100"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Initial Status</Label>
        <Select
          value={formData.status}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="idle">Idle</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Describe the purpose of this machine"
          rows={3}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Machine"}
      </Button>
    </form>
  );
}
