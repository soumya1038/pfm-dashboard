import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { updateProfile, uploadProfilePicture } from "../services/userService";
import { getInitials } from "../utils/formatters";
import { CURRENCIES } from "../utils/constants";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { FiEdit2, FiSave, FiX, FiUpload } from "react-icons/fi";

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "", currency: "USD" });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, currency: user.currency || "USD" });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await updateProfile(formData);
            updateUser(response.user);
            toast.success("Profile updated successfully");
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        setUploading(true);
        try {
            const response = await uploadProfilePicture(file);
            updateUser({ ...user, profilePicture: response.profilePicture });
            toast.success("Profile picture uploaded successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload picture");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>

            <Card>
                <div className="p-6 space-y-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-3xl font-semibold">
                                {user?.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt={user.name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    getInitials(user?.name)
                                )}
                            </div>
                            <label
                                htmlFor="profilePicture"
                                className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full cursor-pointer hover:bg-primary-600 transition-colors"
                            >
                                <FiUpload className="w-4 h-4" />
                                <input
                                    type="file"
                                    id="profilePicture"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                        {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            value={user?.email}
                            disabled
                        />

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Currency</label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                            >
                                {CURRENCIES.map((curr) => (
                                    <option key={curr.code} value={curr.code}>
                                        {curr.code} - {curr.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3">
                            {!isEditing ? (
                                <Button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    variant="primary"
                                    icon={FiEdit2}
                                >
                                    Edit Profile
                                </Button>
                            ) : (
                                <>
                                    <Button type="submit" variant="primary" icon={FiSave} disabled={loading}>
                                        {loading ? "Saving..." : "Save Changes"}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({ name: user.name, currency: user.currency || "USD" });
                                        }}
                                        variant="secondary"
                                        icon={FiX}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default ProfilePage;
