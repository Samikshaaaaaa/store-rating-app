const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const ratingController = require("../controllers/rating.controller");

// ✅ Protect all rating routes
router.use(verifyToken);
router.use(allowRoles("user"));

// ✅ Submit or update a rating
router.post("/:storeId", ratingController.submitRating);

// ✅ Get user's rating for a store
router.get("/:storeId", ratingController.getUserRating);

module.exports = router; // ✅ Export router directly
