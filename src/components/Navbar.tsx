
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Laptop, 
  Play, 
  Activity, 
  Menu,
  X,
  UserRound
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center space-x-2">
          <Activity className="h-6 w-6 text-status-active" />
          <span>Automation Conductor</span>
        </Link>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2 hover:text-status-active transition-colors">
            <Activity className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/machines" className="flex items-center space-x-2 hover:text-status-active transition-colors">
            <Laptop className="h-5 w-5" />
            <span>Machines</span>
          </Link>
          <Link to="/processes" className="flex items-center space-x-2 hover:text-status-active transition-colors">
            <Play className="h-5 w-5" />
            <span>Processes</span>
          </Link>
          <Link to="/agents" className="flex items-center space-x-2 hover:text-status-active transition-colors">
            <UserRound className="h-5 w-5" />
            <span>Agents</span>
          </Link>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden pt-4 pb-2 px-4 space-y-4 bg-gray-800 mt-4">
          <Link 
            to="/" 
            className="block py-2 px-4 hover:bg-gray-700 rounded-md flex items-center space-x-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <Activity className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/machines" 
            className="block py-2 px-4 hover:bg-gray-700 rounded-md flex items-center space-x-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <Laptop className="h-5 w-5" />
            <span>Machines</span>
          </Link>
          <Link 
            to="/processes" 
            className="block py-2 px-4 hover:bg-gray-700 rounded-md flex items-center space-x-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <Play className="h-5 w-5" />
            <span>Processes</span>
          </Link>
          <Link 
            to="/agents" 
            className="block py-2 px-4 hover:bg-gray-700 rounded-md flex items-center space-x-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <UserRound className="h-5 w-5" />
            <span>Agents</span>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
