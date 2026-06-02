module.exports = (sequelize, DataTypes) => {

    const AdditionalDocument = sequelize.define(
        "AdditionalDocument",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true,
                allowNull:false
            },
            
            title : {
                type: DataTypes.STRING,
                allowNull:true
            },

            institution : {
                type: DataTypes.TEXT,
                allowNull:true
            },

            file : {
                type: DataTypes.STRING,
                allowNull:true
            },
        }
    )

    return AdditionalDocument;
}