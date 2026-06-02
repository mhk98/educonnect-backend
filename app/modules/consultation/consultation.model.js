// models/Consultation.js
module.exports = (sequelize, DataTypes) => {
  const Consultation = sequelize.define("Consultation", {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    assignedTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ielts: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ieltsScore: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    appointmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    applicationCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sscYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sscDepartment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sscCGPA: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hscYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    hscDepartment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hscCGPA: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bachelorYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bachelorDepartment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bachelorCGPA: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    agree1: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    agree2: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Consultation;
};
