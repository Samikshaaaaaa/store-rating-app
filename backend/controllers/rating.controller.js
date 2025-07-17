const db = require("../models");
const Rating = db.Rating;


exports.submitRating = async (req, res) => {
  const userId = req.userId;
  const storeId = req.params.storeId;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
   
    const existing = await Rating.findOne({ where: { userId, storeId } });

    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.status(200).json({ message: "Rating updated" });
    } else {
      await Rating.create({
        userId,
        storeId,
        rating
      });
      return res.status(201).json({ message: "Rating submitted" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserRating = async (req, res) => {
  const userId = req.userId;
  const storeId = req.params.storeId;

  try {
    const rating = await Rating.findOne({ where: { userId, storeId } });
    res.status(200).json(rating || { rating: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
