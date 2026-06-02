module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
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
        type: {
          type: DataTypes.STRING,  // This field will store the tab value (e.g., "kc", "student")
          allowNull: false,
        },
      });
      

  
    return Comment;
  };
  