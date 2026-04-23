import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import AccountsBudgetsPage from "./pages/AccountsBudgetsPage";
import SettingsPage from "./pages/SettingsPage";

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/accounts-budgets" element={<AccountsBudgetsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default App;
