module.exports = (sequelize, DataTypes) => {
  const ChatConversation = sequelize.define(
    "ChatConversation",
    {
      userOneId: { type: DataTypes.STRING, allowNull: false },
      userTwoId: { type: DataTypes.STRING, allowNull: false },
      lastMessageId: { type: DataTypes.INTEGER, allowNull: true },
      lastMessageAt: { type: DataTypes.DATE, allowNull: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      indexes: [{ unique: true, fields: ["userOneId", "userTwoId"] }],
      paranoid: true,
    },
  );
  return ChatConversation;
};
