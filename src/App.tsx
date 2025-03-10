
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MachinesPage from "./pages/MachinesPage";
import ProcessesPage from "./pages/ProcessesPage";
import MachineDetailPage from "./pages/MachineDetailPage";
import AddMachinePage from "./pages/AddMachinePage";
import AddProcessPage from "./pages/AddProcessPage";
import AssignProcessPage from "./pages/AssignProcessPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/machines" element={<MachinesPage />} />
          <Route path="/processes" element={<ProcessesPage />} />
          <Route path="/machines/:id" element={<MachineDetailPage />} />
          <Route path="/machines/add" element={<AddMachinePage />} />
          <Route path="/processes/add" element={<AddProcessPage />} />
          <Route path="/processes/assign" element={<AssignProcessPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
