
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMachines, addAgent } from '@/lib/mock-data';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Trash, Clipboard, X } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Machine } from '@/types/orchestrator';

const AddAgentPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    type: '',
    machineIds: [] as string[],
    description: '',
    configuration: {}
  });
  
  const [configKeys, setConfigKeys] = useState<string[]>(['']);
  const [configValues, setConfigValues] = useState<string[]>(['']);
  
  const { data: machines = [] } = useQuery({
    queryKey: ['machines'],
    queryFn: getMachines
  });
  
  const agentTypes = ['Data Sync', 'Monitoring', 'Reporting', 'Backup', 'Integration', 'Analytics', 'Automation'];
  
  const handleConfigKeyChange = (index: number, value: string) => {
    const newConfigKeys = [...configKeys];
    newConfigKeys[index] = value;
    setConfigKeys(newConfigKeys);
    updateConfiguration(newConfigKeys, configValues);
  };
  
  const handleConfigValueChange = (index: number, value: string) => {
    const newConfigValues = [...configValues];
    newConfigValues[index] = value;
    setConfigValues(newConfigValues);
    updateConfiguration(configKeys, newConfigValues);
  };
  
  const updateConfiguration = (keys: string[], values: string[]) => {
    const config: Record<string, string> = {};
    keys.forEach((key, index) => {
      if (key.trim()) {
        config[key] = values[index];
      }
    });
    setForm({
      ...form,
      configuration: config
    });
  };
  
  const addConfigField = () => {
    setConfigKeys([...configKeys, '']);
    setConfigValues([...configValues, '']);
  };
  
  const removeConfigField = (index: number) => {
    if (configKeys.length > 1) {
      const newKeys = configKeys.filter((_, i) => i !== index);
      const newValues = configValues.filter((_, i) => i !== index);
      setConfigKeys(newKeys);
      setConfigValues(newValues);
      updateConfiguration(newKeys, newValues);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!form.name.trim() || !form.type || form.machineIds.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Add the agent
    const newAgent = addAgent(form);
    
    toast.success('Agent added successfully');
    navigate(`/agents/${newAgent.id}`);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMachine = (machineId: string) => {
    if (!form.machineIds.includes(machineId)) {
      setForm(prev => ({
        ...prev,
        machineIds: [...prev.machineIds, machineId]
      }));
    }
  };

  const handleRemoveMachine = (machineId: string) => {
    setForm(prev => ({
      ...prev,
      machineIds: prev.machineIds.filter(id => id !== machineId)
    }));
  };

  const getSelectedMachines = (): Machine[] => {
    return machines.filter(machine => form.machineIds.includes(machine.id));
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/agents">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Add New Agent</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Agent Information</CardTitle>
              <CardDescription>Enter the details for the new agent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Agent Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter agent name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Agent Type <span className="text-red-500">*</span></Label>
                    <Select 
                      value={form.type} 
                      onValueChange={(value) => setForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent type" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Machine Assignment <span className="text-red-500">*</span></Label>
                  <div className="flex flex-col space-y-4">
                    <Select 
                      onValueChange={handleAddMachine}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select machines to add" />
                      </SelectTrigger>
                      <SelectContent>
                        {machines
                          .filter(machine => !form.machineIds.includes(machine.id))
                          .map(machine => (
                            <SelectItem key={machine.id} value={machine.id}>
                              {machine.name} ({machine.status})
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    
                    <div className="border rounded-md p-3">
                      <p className="text-sm text-muted-foreground mb-2">Selected Machines:</p>
                      {form.machineIds.length > 0 ? (
                        <ScrollArea className="max-h-32">
                          <div className="flex flex-wrap gap-2">
                            {getSelectedMachines().map(machine => (
                              <Badge key={machine.id} variant="secondary" className="flex items-center gap-1">
                                {machine.name}
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveMachine(machine.id)}
                                  className="ml-1 text-gray-400 hover:text-gray-700"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <p className="text-sm text-muted-foreground">No machines selected</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter a description for this agent"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Agent Configuration</h3>
                    <p className="text-sm text-muted-foreground">Define the configuration parameters for this agent</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addConfigField}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Parameter
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(form.configuration, null, 2));
                        toast.success('Configuration copied to clipboard');
                      }}
                    >
                      <Clipboard className="h-4 w-4 mr-1" /> Copy JSON
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {configKeys.map((key, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <Input
                          value={key}
                          onChange={(e) => handleConfigKeyChange(index, e.target.value)}
                          placeholder="Parameter name"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          value={configValues[index]}
                          onChange={(e) => handleConfigValueChange(index, e.target.value)}
                          placeholder="Value"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeConfigField(index)}
                        disabled={configKeys.length === 1}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link to="/agents">Cancel</Link>
              </Button>
              <Button type="submit">Create Agent</Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Layout>
  );
};

export default AddAgentPage;
