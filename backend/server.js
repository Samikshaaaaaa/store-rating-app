const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./models");

dotenv.config(); // Load .env first

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes
const authRoutes = require("./routes/auth.routes");
const ownerRoutes = require("./routes/owner.routes");
const adminRoutes = require("./routes/admin.routes");
const storeRoutes = require("./routes/store.routes");
const ratingRoutes = require("./routes/rating.routes");

app.use("/api/auth", authRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);

// ✅ Sync Database (SAFE - No alter/force)
db.sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced and updated (non-destructive)");
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
