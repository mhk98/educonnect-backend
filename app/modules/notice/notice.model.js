module.exports = (sequelize, DataTypes) => {

    const Notice = sequelize.define(
        "Notice",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true,
                allowNull:false
            },

            title: {
                type: DataTypes.STRING,
                allowNull:true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull:true,
            },

        }
    )

    return Notice;
}