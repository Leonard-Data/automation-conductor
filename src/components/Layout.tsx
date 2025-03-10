
import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1 p-6">
        {children}
      </main>
      <footer className="bg-gray-800 text-gray-400 py-4 px-6 text-center text-sm">
        Automation Conductor &copy; {new Date().getFullYear()} - Orchestrating your workflows
      </footer>
    </div>
  );
};

export default Layout;
