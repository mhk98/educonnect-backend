module.exports = (sequelize, DataTypes) => {

    const ProgramYear = sequelize.define(
        "ProgramYear",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true,
                allowNull:false
            },

            year: {
                type: DataTypes.INTEGER,
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

    return ProgramYear;
}