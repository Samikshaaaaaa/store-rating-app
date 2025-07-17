module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Store", {
    name: { type: DataTypes.STRING(60), allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    address: { type: DataTypes.STRING(400) },
  });
};
