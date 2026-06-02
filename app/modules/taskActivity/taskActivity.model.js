module.exports = (sequelize, DataTypes) => {
  const TaskActivity = sequelize.define("taskActivity", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    action: {
      type: DataTypes.ENUM(
        "CREATED",
        "STATUS_CHANGED",
        "ASSIGNED",
        "COMMENT_ADDED",
        "COMMENT_EDITED",
        "COMMENT_DELETED",
        "MENTIONED",
      ),
      allowNull: false,
    },

    from_value: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    to_value: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    meta: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  });

  return TaskActivity;
};
