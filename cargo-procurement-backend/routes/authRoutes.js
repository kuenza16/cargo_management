const express = require("express");
const {
  register,
  login,
  me,
  getUserById,
  deleteUserById,
  getAllUsers,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);

// Fetch user by ID
router.get("/user/:id", getUserById);

// Delete user by ID
router.delete("/user/:id", deleteUserById);

// Fetch all users
router.get("/users", getAllUsers);

module.exports = router;
