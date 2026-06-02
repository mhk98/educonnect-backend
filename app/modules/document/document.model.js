module.exports = (sequelize, DataTypes) => {

    const Doccument = sequelize.define(
        "Doccument",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true,
                allowNull:false
            },
            tenthMarksheet: {
                type: DataTypes.STRING,
                allowNull:true
            },
            tenthCertificate: {
                type: DataTypes.STRING,
                allowNull:true
            },
            twelveMarksheet: {
                type: DataTypes.STRING,
                allowNull:true
            },
            twelveCertificate: {
                type: DataTypes.STRING,
                allowNull:true
            },
            bachelorCertificate: {
                type: DataTypes.STRING,
                allowNull:true
            },
            bachelorTranscript: {
                type: DataTypes.STRING,
                allowNull:true
            },
            passport: {
                type: DataTypes.STRING,
                allowNull:true
            },
            essay: {
                type: DataTypes.STRING,
                allowNull:true
            },
            instructionLetter : {
                type: DataTypes.STRING,
                allowNull:true
            },
        }
    )

    return Doccument;
}