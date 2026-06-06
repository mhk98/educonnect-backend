module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define("Branch", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deletedAt: { type: DataTypes.DATE, allowNull: true },
  }, { paranoid: true });

  return Branch;
};
