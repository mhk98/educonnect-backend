const validator = require("validator");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },

      FirstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      LastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      Phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      Assigned: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      CreatedOn: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      Status: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      Address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      RegionalStatus: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      Profile: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "active",
      },

      Branch: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      Role: {
        type: DataTypes.ENUM("student", "employee", "admin", "superAdmin"),
        allowNull: true,
        defaultValue: "student",
      },
    },
    {
      hooks: {
        // ✅ Assign custom ID before validation
        beforeValidate: async (user, options) => {
          if (!user.id) {
            const lastUser = await User.findOne({
              order: [["createdAt", "DESC"]],
            });

            let nextId = "EA001";
            if (lastUser && lastUser.id) {
              const lastIdNum = parseInt(lastUser.id.slice(2));
              const newIdNum = lastIdNum + 1;
              nextId = "EA" + newIdNum.toString().padStart(3, "0");
            }

            user.id = nextId;
          }
        },

        // ✅ Hash password before creation
        beforeCreate: async (user) => {
          if (user.Password) {
            const salt = await bcrypt.genSalt(10);
            user.Password = bcrypt.hashSync(user.Password, salt);
          }
        },

        // ✅ Hash password before update (if changed)
        beforeUpdate: async (user) => {
          if (user.changed("Password") && user.Password) {
            const salt = await bcrypt.genSalt(10);
            user.Password = bcrypt.hashSync(user.Password, salt);
          }
        },
      },
    },
  );

  // ✅ Method to compare password
  User.prototype.validPassword = async function (Password) {
    return await bcrypt.compare(Password, this.Password);
  };

  return User;
};
