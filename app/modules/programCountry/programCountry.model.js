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

        }
    )

    return ProgramCountry;
}