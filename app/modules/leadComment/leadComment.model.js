module.exports = (sequelize, DataTypes) => {
    const LeadComment = sequelize.define("LeadComment", {
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
       

  
    return LeadComment;
  };
  