module.exports = (sequelize, DataTypes) => {
    const KCReply = sequelize.define("KCReply", {
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
      file: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });
  
    return KCReply;
  };
  