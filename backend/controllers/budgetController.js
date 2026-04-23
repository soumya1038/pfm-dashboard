const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// Get all budgets for user
exports.getAllBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get current month budgets
exports.getCurrentMonthBudgets = async (req, res) => {
    try {
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        
        const budgets = await Budget.find({ 
            userId: req.user.id, 
            month, 
            year,
            isActive: true 
        });
        
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get single budget
exports.getBudget = async (req, res) => {
    try {
        const budget = await Budget.findOne({ _id: req.params.id, userId: req.user.id });
        
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        
        res.json(budget);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create budget
exports.createBudget = async (req, res) => {
    try {
        const { category, monthlyLimit, month, year, alertThreshold } = req.body;
        
        if (!category || !monthlyLimit || !month || !year) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        
        // Check if budget already exists for this category, month, and year
        const existingBudget = await Budget.findOne({
            userId: req.user.id,
            category,
            month,
            year,
        });
        
        if (existingBudget) {
            return res.status(400).json({ message: "Budget already exists for this category and period" });
        }
        
        // Calculate current spent for this category
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        
        const transactions = await Transaction.find({
            userId: req.user.id,
            category,
            type: "expense",
            date: { $gte: startDate, $lte: endDate },
        });
        
        const currentSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
        
        const budget = await Budget.create({
            userId: req.user.id,
            category,
            monthlyLimit,
            currentSpent,
            month,
            year,
            alertThreshold: alertThreshold || 80,
        });
        
        res.status(201).json(budget);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update budget
exports.updateBudget = async (req, res) => {
    try {
        const { monthlyLimit, alertThreshold, isActive } = req.body;
        
        const budget = await Budget.findOne({ _id: req.params.id, userId: req.user.id });
        
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        
        if (monthlyLimit !== undefined) budget.monthlyLimit = monthlyLimit;
        if (alertThreshold !== undefined) budget.alertThreshold = alertThreshold;
        if (isActive !== undefined) budget.isActive = isActive;
        
        await budget.save();
        
        res.json(budget);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete budget
exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        
        res.json({ message: "Budget deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update budget spent amount (called when transactions are added)
const updateBudgetSpent = async (userId, category, month, year) => {
    try {
        const budget = await Budget.findOne({ userId, category, month, year });
        
        if (!budget) return;
        
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        
        const transactions = await Transaction.find({
            userId,
            category,
            type: "expense",
            date: { $gte: startDate, $lte: endDate },
        });
        
        budget.currentSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
        await budget.save();
    } catch (error) {
        console.error("Error updating budget spent:", error.message);
    }
};

module.exports = {
    getAllBudgets: exports.getAllBudgets,
    getCurrentMonthBudgets: exports.getCurrentMonthBudgets,
    getBudget: exports.getBudget,
    createBudget: exports.createBudget,
    updateBudget: exports.updateBudget,
    deleteBudget: exports.deleteBudget,
    updateBudgetSpent,
};
