import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData.email, formData.password, formData.rememberMe);
            toast.success("Login successful!");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to PFM Dashboard</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                    
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                    />
                    
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>
                    
                    <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>
                
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary-500 hover:underline font-medium">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
