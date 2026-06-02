module.exports = (sequelize, DataTypes) => {

    const Commission = sequelize.define(
        "Commission",
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
            assignedTo_id: {
                type: DataTypes.STRING(255),
                allowNull:true
            },            
            assignor: {
                type: DataTypes.STRING(255),
                allowNull:true
            },            
            assignedTo: {
                type: DataTypes.STRING(255),
                allowNull:true
            },            
           Branch: {
                type: DataTypes.STRING(255),
                allowNull:true
            },          
            status: {
                type: DataTypes.STRING,
                allowNull:true,
                defaultValue:"PENDING"
            },             
            file: {
                type: DataTypes.STRING,
                allowNull:true,
            },             
                       
        }
    )

    return Commission;
}