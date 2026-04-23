const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    getDashboardSummary,
    getSpendingByCategory,
    getIncomeVsExpense,
    getRecentTransactions,
    getBudgetOverview,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/summary", protect, getDashboardSummary);
router.get("/spending-by-category", protect, getSpendingByCategory);
router.get("/income-vs-expense", protect, getIncomeVsExpense);
router.get("/recent-transactions", protect, getRecentTransactions);
router.get("/budget-overview", protect, getBudgetOverview);

module.exports = router;
