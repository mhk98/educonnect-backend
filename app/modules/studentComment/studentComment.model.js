module.exports = (sequelize, DataTypes) => {
    const StudentComment = sequelize.define("StudentComment", {
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
         file: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      });
      

  
    return StudentComment;
  };
  