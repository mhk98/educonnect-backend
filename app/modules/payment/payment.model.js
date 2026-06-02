module.exports = (sequelize, DataTypes) => {

    const Payment = sequelize.define(
        "Payment",
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
            paymentReason: {
                type: DataTypes.STRING,
                allowNull:true
            },
            refundCondition: {
                type: DataTypes.STRING,
                allowNull:true
            },       
            paymentStatus : {
                type: DataTypes.STRING,
                allowNull:true
            },       
            file : {
                type: DataTypes.STRING,
                allowNull:true
            },       
        }
    )

    return Payment;
}