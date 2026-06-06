// models/notification.js
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    "Notification",
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      branch: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false, // Enquiries, Tasks, Payments etc.
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "notifications",
      timestamps: true,
      paranoid: true,
    },
  );

  return Notification;
};
