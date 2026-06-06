module.exports = (sequelize, DataTypes) => {
    const Reply = sequelize.define("Reply", {
        id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
        allowNull: true,
          },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    }, { paranoid: true });

    return Reply;
  };
  