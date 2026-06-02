module.exports = (sequelize, DataTypes) => {

    const Tests = sequelize.define(
        "Tests",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true,
                allowNull:false
            },

            examinationDate: {
                type: DataTypes.DATEONLY,
                allowNull:true
            },

            waiver: {
                type: DataTypes.STRING,
                allowNull:true
            },

            overallScore: {
                type: DataTypes.INTEGER,
                allowNull:true
            },

            listening: {
                type: DataTypes.INTEGER,
                allowNull:true
            },

            reading: {
                type: DataTypes.INTEGER,
                allowNull:true
            },

            writing: {
                type: DataTypes.INTEGER,
                allowNull:true
            },

            speaking: {
                type: DataTypes.INTEGER,
                allowNull:true
            },

            trfNo: {
                type: DataTypes.STRING,
                allowNull:true
            },


           
        }
    )

    return Tests;
}