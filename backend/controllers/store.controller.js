const db = require("../models");
const Store = db.Store;
const Rating = db.Rating;
const User = db.User;
const { Op } = require("sequelize");

exports.getAllStores = async (req, res) => {
  try {
    const { name, address } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      include: [
        { model: Rating },
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
      ],
    });

    const response = stores.map((store) => {
      const ratings = store.Ratings.map((r) => r.rating);
      const avgRating = ratings.length
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
        : "N/A";

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating: avgRating,
        owner: store.owner?.name || null,
      };
    });

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [
        { model: Rating },
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
      ],
    });

    if (!store) return res.status(404).json({ message: "Store not found" });

    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
