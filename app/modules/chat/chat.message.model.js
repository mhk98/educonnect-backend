module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define("ChatMessage", {
    conversationId: { type: DataTypes.INTEGER, allowNull: false },
    senderUserId: { type: DataTypes.STRING, allowNull: false },
    receiverUserId: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    messageType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "text",
    },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    readAt: { type: DataTypes.DATE, allowNull: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true },
  }, { paranoid: true });
  return ChatMessage;
};
