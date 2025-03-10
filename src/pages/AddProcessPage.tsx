
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import AddProcessForm from "@/components/forms/AddProcessForm";
import { ArrowLeft, Workflow } from "lucide-react";

export default function AddProcessPage() {
  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <Link 
            to="/processes" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Processes
          </Link>
          
          <div className="flex items-center space-x-3 mt-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Workflow className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold">Add New Process</h1>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Create a new automation process in your network
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <AddProcessForm />
        </div>
      </div>
    </Layout>
  );
}
