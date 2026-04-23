const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

// Get dashboard summary
exports.getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get total balance from all accounts
        const accounts = await Account.find({ userId, isActive: true });
        const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
        
        // Get current month income and expenses
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
        
        const transactions = await Transaction.find({
            userId,
            date: { $gte: startOfMonth, $lte: endOfMonth },
        });
        
        const totalIncome = transactions
            .filter(t => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpense = transactions
            .filter(t => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);
        
        const netSavings = totalIncome - totalExpense;
        
        res.json({
            totalBalance,
            totalIncome,
            totalExpense,
            netSavings,
            accountsCount: accounts.length,
            transactionsCount: transactions.length,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get spending by category
exports.getSpendingByCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;
        
        const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const end = endDate ? new Date(endDate) : new Date();
        
        const transactions = await Transaction.find({
            userId,
            type: "expense",
            date: { $gte: start, $lte: end },
        });
        
        const categoryMap = {};
        
        transactions.forEach(t => {
            if (!categoryMap[t.category]) {
                categoryMap[t.category] = 0;
            }
            categoryMap[t.category] += t.amount;
        });
        
        const spendingByCategory = Object.keys(categoryMap).map(category => ({
            category,
            amount: categoryMap[category],
        }));
        
        res.json(spendingByCategory);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get income vs expense (last 6 months)
exports.getIncomeVsExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const months = 6;
        const data = [];
        
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
            
            const transactions = await Transaction.find({
                userId,
                date: { $gte: startOfMonth, $lte: endOfMonth },
            });
            
            const income = transactions
                .filter(t => t.type === "income")
                .reduce((sum, t) => sum + t.amount, 0);
            
            const expense = transactions
                .filter(t => t.type === "expense")
                .reduce((sum, t) => sum + t.amount, 0);
            
            data.push({
                month: startOfMonth.toLocaleString('default', { month: 'short', year: 'numeric' }),
                income,
                expense,
            });
        }
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get recent transactions
exports.getRecentTransactions = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        
        const transactions = await Transaction.find({ userId: req.user.id })
            .sort({ date: -1 })
            .limit(limit)
            .populate("accountId", "bankName accountType");
        
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get budget overview
exports.getBudgetOverview = async (req, res) => {
    try {
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        
        const budgets = await Budget.find({
            userId: req.user.id,
            month,
            year,
            isActive: true,
        });
        
        const budgetOverview = budgets.map(budget => {
            const percentageUsed = (budget.currentSpent / budget.monthlyLimit) * 100;
            const isOverBudget = percentageUsed > 100;
            const isNearLimit = percentageUsed >= budget.alertThreshold;
            
            return {
                ...budget.toObject(),
                percentageUsed: Math.round(percentageUsed),
                isOverBudget,
                isNearLimit,
                remaining: budget.monthlyLimit - budget.currentSpent,
            };
        });
        
        res.json(budgetOverview);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
