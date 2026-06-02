module.exports = (sequelize, DataTypes) => {
    const StudentReply = sequelize.define("StudentReply", {
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
  
    return StudentReply;
  };
  