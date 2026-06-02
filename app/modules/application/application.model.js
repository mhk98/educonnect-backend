module.exports = (sequelize, DataTypes) => {

    const Application = sequelize.define(
        "Application",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true,
                allowNull:false
            },
            FirstName: {
                type: DataTypes.STRING,
                allowNull:true
            },
            LastName: {
                type: DataTypes.STRING,
                allowNull:true
            },
            year: {
                type: DataTypes.STRING,
                allowNull:true
            },
            acknowledge: {
                type: DataTypes.STRING,
                allowNull:true
            },
            intake: {
                type: DataTypes.STRING,
                allowNull:true
            },
            university: {
                type: DataTypes.STRING,
                allowNull:true
            },
            program: {
                type: DataTypes.STRING,
                allowNull:true
            },
            priority: {
                type: DataTypes.STRING,
                allowNull:true
            },
            country: {
                type: DataTypes.STRING,
                allowNull:true
            },
            Branch: {
                type: DataTypes.STRING(255),
                allowNull:true
            },
            status: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue:"Application Submitted"
              },
              
            assignee: {
                type: DataTypes.STRING,
                allowNull:true
            },
         
     
  
        }
    )

    return Application;
}