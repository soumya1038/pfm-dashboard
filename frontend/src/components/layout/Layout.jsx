import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Loader from "../common/Loader";

const Layout = () => {
    const { isAuthenticated, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-background-light">
            <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            
            <div className="flex">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                
                <main className="flex-1 p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
