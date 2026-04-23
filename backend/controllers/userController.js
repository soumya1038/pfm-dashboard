const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, currency } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (name) user.name = name;
        if (currency) user.currency = currency;
        
        await user.save();
        
        const updatedUser = await User.findById(req.user.id).select("-password");
        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "pfm-dashboard/profiles",
            width: 300,
            height: 300,
            crop: "fill",
        });
        
        const user = await User.findById(req.user.id);
        user.profilePicture = result.secure_url;
        await user.save();
        
        res.json({ message: "Profile picture uploaded successfully", profilePicture: result.secure_url });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Please provide current and new password" });
        }
        
        const user = await User.findById(req.user.id).select("+password");
        
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }
        
        user.password = newPassword;
        await user.save();
        
        res.json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete account
exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
