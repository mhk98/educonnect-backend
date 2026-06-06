module.exports = (sequelize, DataTypes) => {
  const TaskComment = sequelize.define("taskComment", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    deletedAt: { type: DataTypes.DATE, allowNull: true },
  }, { paranoid: true });

  return TaskComment;
};
