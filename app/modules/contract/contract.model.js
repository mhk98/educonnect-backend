module.exports = (sequelize, DataTypes) => {

    const Contract = sequelize.define(
        "Contract",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true,
                allowNull:false
            },
            registrationFees : {
                type: DataTypes.INTEGER,
                allowNull:true
            },
            visaDocumentsFees: {
                type: DataTypes.INTEGER,
                allowNull:true
            },
            serviceCharge: {
                type: DataTypes.INTEGER,
                allowNull:true
            },             
            spouseServicecharge: {
                type: DataTypes.INTEGER,
                allowNull:true
            },             
            applicationCode: {
                type: DataTypes.STRING,
                allowNull:true
            },             
            note: {
                type: DataTypes.STRING,
                allowNull:true
            },             
                       
        }
    )

    return Contract;
}