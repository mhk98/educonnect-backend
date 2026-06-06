module.exports = (sequelize, DataTypes) => {

    const PreviousPayment = sequelize.define(
        "PreviousPayment",
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
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        { paranoid: true }
    )

    return PreviousPayment;
}