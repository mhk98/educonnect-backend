module.exports = (sequelize, DataTypes) => {
  const ExternalConversation = sequelize.define(
    "ExternalConversation",
    {
      platform: {
        type: DataTypes.ENUM("facebook", "whatsapp"),
        allowNull: false,
      },
      externalId: { type: DataTypes.STRING, allowNull: false },
      senderName: { type: DataTypes.STRING, allowNull: true },
      lastMessage: { type: DataTypes.TEXT, allowNull: true },
      lastMessageAt: { type: DataTypes.DATE, allowNull: true },
      unreadCount: { type: DataTypes.INTEGER, defaultValue: 0 },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      indexes: [{ unique: true, fields: ["platform", "externalId"] }],
      paranoid: true,
    },
  );
  return ExternalConversation;
};
