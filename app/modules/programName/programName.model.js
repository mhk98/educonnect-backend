module.exports = (sequelize, DataTypes) => {

    const ProgramName = sequelize.define(
        "ProgramName",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true,
                allowNull:false
            },

            program: {
            type: DataTypes.STRING(255),
            allowNull:true,
            },

            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        { paranoid: true }
    )

    return ProgramName;
}