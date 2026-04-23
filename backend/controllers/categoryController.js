const Category = require("../models/Category");

// Get all categories (predefined + user's custom)
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({
            $or: [
                { isPredefined: true },
                { userId: req.user.id }
            ]
        }).sort({ isPredefined: -1, name: 1 });
        
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create custom category
exports.createCategory = async (req, res) => {
    try {
        const { name, type, icon, color } = req.body;
        
        if (!name || !type) {
            return res.status(400).json({ message: "Please provide name and type" });
        }
        
        // Check if category already exists for this user
        const existingCategory = await Category.findOne({
            name,
            $or: [
                { isPredefined: true },
                { userId: req.user.id }
            ]
        });
        
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }
        
        const category = await Category.create({
            name,
            type,
            icon: icon || "📁",
            color: color || "#3B82F6",
            isPredefined: false,
            userId: req.user.id,
        });
        
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete custom category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ 
            _id: req.params.id, 
            userId: req.user.id,
            isPredefined: false 
        });
        
        if (!category) {
            return res.status(404).json({ message: "Category not found or cannot be deleted" });
        }
        
        await category.deleteOne();
        
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
