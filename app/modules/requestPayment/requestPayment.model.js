module.exports = (sequelize, DataTypes) => {

    const RequestPayment = sequelize.define(
        "RequestPayment",
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
            status: {
                type: DataTypes.STRING,
                allowNull:true,
                defaultValue: "PENDING",

            },
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        { paranoid: true }
    )

    return RequestPayment;
}