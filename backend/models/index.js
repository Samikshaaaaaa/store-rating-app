const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.model")(sequelize, DataTypes);
db.Store = require("./store.model")(sequelize, DataTypes);
db.Rating = require("./rating.model")(sequelize, DataTypes);

db.User.hasMany(db.Rating, { foreignKey: "userId" });
db.Rating.belongsTo(db.User, { foreignKey: "userId" });

db.Store.hasMany(db.Rating, { foreignKey: "storeId" });
db.Rating.belongsTo(db.Store, { foreignKey: "storeId" });

db.Store.belongsTo(db.User, { as: "owner", foreignKey: "ownerId" });
db.User.hasMany(db.Store, { foreignKey: "ownerId" });

module.exports = db;
