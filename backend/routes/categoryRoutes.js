const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    getAllCategories,
    createCategory,
    deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", protect, getAllCategories);
router.post("/", protect, createCategory);
router.delete("/:id", protect, deleteCategory);

module.exports = router;
