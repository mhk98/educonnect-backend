module.exports = (sequelize, DataTypes) => {
  const ExternalMessage = sequelize.define("ExternalMessage", {
    conversationId: { type: DataTypes.INTEGER, allowNull: false },
    platform: {
      type: DataTypes.ENUM("facebook", "whatsapp"),
      allowNull: false,
    },
    externalId: { type: DataTypes.STRING, allowNull: false },
    senderName: { type: DataTypes.STRING, allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    direction: {
      type: DataTypes.ENUM("incoming", "outgoing"),
      allowNull: false,
    },
    platformMessageId: { type: DataTypes.STRING, allowNull: true },
    repliedByName: { type: DataTypes.STRING, allowNull: true },
  });
  return ExternalMessage;
};
