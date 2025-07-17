const express = require("express");
const router = express.Router();
const { User, Store, Rating } = require("../models");
const verifyToken = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const adminController = require("../controllers/admin.controller");

// GET /api/admin/dashboard
router.get("/dashboard", verifyToken, allowRoles("admin"), async (req, res) => {
  const totalUsers = await User.count();
  const totalStores = await Store.count();
  const totalRatings = await Rating.count();

  const users = await User.findAll({ attributes: ["id", "name", "email", "address", "role"] });
  const stores = await Store.findAll({
    include: [
      {
        model: Rating,
        attributes: ["rating"]
      }
    ]
  });

  const storeList = stores.map(store => ({
    id: store.id,
    name: store.name,
    email: store.email,
    address: store.address,
    averageRating: store.Ratings.length
      ? (store.Ratings.reduce((sum, r) => sum + r.rating, 0) / store.Ratings.length).toFixed(2)
      : "N/A"
  }));

  res.json({
    stats: { totalUsers, totalStores, totalRatings },
    users,
    stores: storeList
  });
});

// POST /api/admin/users - add new user
router.post("/users", verifyToken, allowRoles("admin"), adminController.addUser);

// POST /api/admin/stores - add new store
router.post("/stores", verifyToken, allowRoles("admin"), adminController.addStore);

module.exports = router;
