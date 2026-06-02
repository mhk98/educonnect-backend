module.exports = (sequelize, DataTypes) => {

    const PendingPayment = sequelize.define(
        "PendingPayment",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true,
                allowNull:false
            },                
            transactionId: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
              },
              amount: {
                type: DataTypes.FLOAT,
                allowNull: false,
              },
              status: {
                type: DataTypes.ENUM("PENDING", "PAID", "FAILED"),
                defaultValue: "PENDING",
              },
              file: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              paymentStatus : {
                type: DataTypes.STRING,
                allowNull:true,
            },  
            employee : {
                type: DataTypes.STRING,
                allowNull:true,
            },  
            purpose : {
                type: DataTypes.STRING,
                allowNull:true,
            },  
            branch : {
                type: DataTypes.STRING,
                allowNull:true,
            },  
            name : {
                type: DataTypes.STRING,
                allowNull:true,
            },  
            phone : {
                type: DataTypes.STRING,
                allowNull:true,
            },  
            address : {
                type: DataTypes.STRING,
                allowNull:true,
            },  
              paymentGatewayData: {
                type: DataTypes.JSON,
                allowNull: true,
              },
        }
    )

    return PendingPayment;
}