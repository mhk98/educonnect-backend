module.exports = (sequelize, DataTypes) => {

    const ProgramIntake = sequelize.define(
        "ProgramIntake",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true,
                allowNull:false
            },

            intake: {
                type: DataTypes.STRING,
                allowNull:true,
                unique: true,

            },

        }
    )

    return ProgramIntake;
}