const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getAccounts, connectAccount } = require("../controllers/accountController");

const router = express.Router();

router.get("/", protect, getAccounts);
router.post("/connect", protect, connectAccount);

module.exports = router;
