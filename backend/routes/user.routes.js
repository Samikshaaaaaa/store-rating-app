// routes/user.routes.js
const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");

module.exports = (app) => {
  const router = express.Router();

  // Protect all user routes with token
  router.use(verifyToken);
  router.use(allowRoles("user"));

  // Example protected route
  router.get("/me", (req, res) => {
    res.json({ message: "User route working!", userId: req.userId });
  });

  app.use("/api/user", router);
};
