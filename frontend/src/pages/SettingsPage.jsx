import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { changePassword, deleteUserAccount } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { CURRENCIES } from "../utils/constants";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { FiSave, FiTrash2 } from "react-icons/fi";

const SettingsPage = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        
        if (passwordForm.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        
        setLoading(true);
        try {
            await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            toast.success("Password changed successfully");
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
        );
        
        if (!confirmed) return;
        
        const doubleConfirm = window.prompt('Type "DELETE" to confirm account deletion:');
        
        if (doubleConfirm !== "DELETE") {
            toast.error("Account deletion cancelled");
            return;
        }
        
        setDeleting(true);
        try {
            await deleteUserAccount();
            toast.success("Account deleted successfully");
            logout();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete account");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

            {/* Change Password */}
            <Card title="Change Password">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <Input
                        label="Current Password"
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                        required
                    />
                    
                    <Input
                        label="New Password"
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                        required
                    />
                    
                    <Input
                        label="Confirm New Password"
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                        required
                    />
                    
                    <Button type="submit" variant="primary" icon={FiSave} disabled={loading}>
                        {loading ? "Changing..." : "Change Password"}
                    </Button>
                </form>
            </Card>

            {/* Preferences */}
            <Card title="Preferences">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Default Currency</label>
                        <p className="text-gray-600">
                            Current: {user?.currency || "USD"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            You can change your currency in the Profile page
                        </p>
                    </div>
                </div>
            </Card>

            {/* Danger Zone */}
            <Card title="Danger Zone">
                <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Delete Account</h3>
                        <p className="text-sm text-red-700 mb-4">
                            Once you delete your account, there is no going back. All your data including accounts, transactions, and budgets will be permanently deleted.
                        </p>
                        <Button
                            onClick={handleDeleteAccount}
                            variant="danger"
                            icon={FiTrash2}
                            disabled={deleting}
                        >
                            {deleting ? "Deleting..." : "Delete My Account"}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SettingsPage;
