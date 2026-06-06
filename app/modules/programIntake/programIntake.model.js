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

            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        { paranoid: true }
    )

    return ProgramIntake;
}