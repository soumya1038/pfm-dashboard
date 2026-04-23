const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    getAllBudgets,
    getCurrentMonthBudgets,
    getBudget,
    createBudget,
    updateBudget,
    deleteBudget,
} = require("../controllers/budgetController");

const router = express.Router();

router.get("/", protect, getAllBudgets);
router.get("/current", protect, getCurrentMonthBudgets);
router.get("/:id", protect, getBudget);
router.post("/", protect, createBudget);
router.put("/:id", protect, updateBudget);
router.delete("/:id", protect, deleteBudget);

module.exports = router;
