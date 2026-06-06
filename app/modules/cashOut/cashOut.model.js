module.exports = (sequelize, DataTypes) => {

    const cashOut = sequelize.define(
        "cashOut",
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

            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        { paranoid: true }
    )

    return cashOut;
}