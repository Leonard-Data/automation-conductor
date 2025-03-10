
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import AddMachineForm from "@/components/forms/AddMachineForm";
import { ArrowLeft, Server } from "lucide-react";

export default function AddMachinePage() {
  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <Link 
            to="/machines" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Machines
          </Link>
          
          <div className="flex items-center space-x-3 mt-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Server className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold">Add New Machine</h1>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Add a new machine to your automation network
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <AddMachineForm />
        </div>
      </div>
    </Layout>
  );
}
