const db = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

const User = db.User;
const Store = db.Store;
const Rating = db.Rating;


exports.addUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    if (!["admin", "user", "owner"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'admin', 'user' or 'owner'" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, address, password: hashed, role });

    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const owner = await User.findByPk(ownerId);
    if (!owner || owner.role !== "owner") {
      return res.status(400).json({ message: "Invalid store owner" });
    }

    const store = await Store.create({ name, email, address, ownerId: ownerId });

    res.status(201).json({ message: "Store added", store });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.count();
    const storeCount = await Store.count();
    const ratingCount = await Rating.count();

    res.json({ userCount, storeCount, ratingCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { name, email, role, address } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (role) where.role = role;
    if (address) where.address = { [Op.like]: `%${address}%` };

    const users = await User.findAll({ where });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [
        { model: Rating, attributes: ["rating"] },
        { model: User, as: "owner", attributes: ["name", "email"] }
      ]
    });

    const response = stores.map(store => {
      const ratings = store.Ratings.map(r => r.rating);
      const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b) / ratings.length).toFixed(2) : "N/A";

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: avgRating,
        owner: store.owner ? store.owner.name : null
      };
    });

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
