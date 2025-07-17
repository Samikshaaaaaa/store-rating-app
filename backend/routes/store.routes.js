const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const storeController = require("../controllers/store.controller");

// Protected routes
router.use(verifyToken);

// GET all stores
router.get("/", storeController.getAllStores);

// GET store by ID
router.get("/:id", storeController.getStoreById);

module.exports = router;
