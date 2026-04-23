const express = require("express");
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const {
    getProfile,
    updateProfile,
    uploadProfilePicture,
    changePassword,
    deleteAccount,
} = require("../controllers/userController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/profile/picture", protect, upload.single("profilePicture"), uploadProfilePicture);
router.put("/password", protect, changePassword);
router.delete("/account", protect, deleteAccount);

module.exports = router;
