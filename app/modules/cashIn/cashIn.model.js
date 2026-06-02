module.exports = (sequelize, DataTypes) => {

    const CashIn = sequelize.define(
        "CashIn",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true,
                allowNull:false
            },
            amount: {
                type: DataTypes.INTEGER,
                allowNull:true
            },
            purpose: {
                type: DataTypes.STRING,
                allowNull:true
            },
            comment: {
                type: DataTypes.STRING,
                allowNull:true
            },             
            status: {
                type: DataTypes.STRING,
                allowNull:true
            },             
                       
        }
    )

    return CashIn;
}