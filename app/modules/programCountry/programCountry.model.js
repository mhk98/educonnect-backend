module.exports = (sequelize, DataTypes) => {

    const ProgramCountry = sequelize.define(
        "ProgramCountry",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true,
                allowNull:false
            },

            country: {
                type: DataTypes.STRING,
                allowNull:true,
                unique: true,
            },

            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        { paranoid: true }
    )

    return ProgramCountry;
}