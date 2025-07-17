const express = require("express");
const router = express.Router();
const { Store, Rating, User } = require("../models");
const verifyToken = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");

// GET /api/owner/ratings
router.get("/ratings", verifyToken, allowRoles("owner"), async (req, res) => {
  try {
    console.log("Owner ID from token:", req.userId);

    const stores = await Store.findAll({
      where: { ownerId: req.userId },
      include: [
        {
          model: Rating,
          include: [User]
        }
      ]
    });

    console.log("Stores found for owner:", stores);

    const formatted = stores.map((store) => ({
      id: store.id,
      name: store.name,
      averageRating: store.Ratings.length
        ? (
            store.Ratings.reduce((sum, r) => sum + r.rating, 0) /
            store.Ratings.length
          ).toFixed(2)
        : "N/A",
      ratings: store.Ratings.map((r) => ({
        userId: r.UserId,
        rating: r.rating
      }))
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Owner Ratings Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
