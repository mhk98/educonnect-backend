module.exports = (sequelize, DataTypes) => {

    const Enquiries = sequelize.define(
        "Enquiries",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true,
                allowNull:false
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull:true
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull:true
            },
            destination: {
                type: DataTypes.STRING,
                allowNull:true
            },
            educationCountry: {
                type: DataTypes.STRING,
                allowNull:true
            },
            educationLevel: {
                type: DataTypes.STRING,
                allowNull:true
            },
            assignedTo: {
                type: DataTypes.STRING,
                allowNull:true
            },
            additionalInfo: {
                type: DataTypes.STRING,
                allowNull:true
            },             
            Branch: {
                type: DataTypes.STRING(255),
                allowNull:true
            },            
            Status: {
                type: DataTypes.STRING,
                allowNull:true,
                defaultValue:"active"
            },             
            studyArea: {
                type: DataTypes.TEXT,
                allowNull: false,
                defaultValue: "[]",
                get() {
                  try {
                    return JSON.parse(this.getDataValue("studyArea")) || [];
                  } catch (error) {
                    return [];
                  }
                },
                set(value) {
                  this.setDataValue("studyArea", JSON.stringify(value));
                },
              },

              studyLevel: {
                type: DataTypes.TEXT,
                allowNull: false,
                defaultValue: "[]",
                get() {
                  try {
                    return JSON.parse(this.getDataValue("studyLevel")) || [];
                  } catch (error) {
                    return [];
                  }
                },
                set(value) {
                  this.setDataValue("studyLevel", JSON.stringify(value));
                },
              },           
              files: {
                type: DataTypes.TEXT,
                allowNull: true,
                defaultValue: "[]",
                get() {
                  try {
                    return JSON.parse(this.getDataValue("files")) || [];
                  } catch (error) {
                    return [];
                  }
                },
                set(value) {
                  this.setDataValue("files", JSON.stringify(value));
                },
              },
                           
                       
        }
    )

    return Enquiries;
}