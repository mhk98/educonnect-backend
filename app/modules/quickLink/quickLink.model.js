module.exports = (sequelize, DataTypes) => {
  const QuickLink = sequelize.define("QuickLink", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    href: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  });

  return QuickLink;
};
