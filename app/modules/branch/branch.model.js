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
  });

  return Branch;
};
