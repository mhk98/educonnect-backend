module.exports = (sequelize, DataTypes) => {

    const Profile = sequelize.define(
        "Profile",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true,
                allowNull:false
            },
            dob: {
                type: DataTypes.DATEONLY,
                allowNull:true
            },
            gender: {
                type: DataTypes.STRING,
                allowNull:true
            },
            maritalStatus: {
                type: DataTypes.STRING,
                allowNull:true
            },
            mailingAddress1: {
                type: DataTypes.TEXT,
                allowNull:true
            },
            mailingAddress2: {
                type: DataTypes.TEXT,
                allowNull:true
            },
            mailingCountry: {
                type: DataTypes.STRING,
                allowNull:true
            },
            mailingState: {
                type: DataTypes.STRING,
                allowNull:true
            },
            mailingCity: {
                type: DataTypes.STRING,
                allowNull:true
            },
            mailingPostalCode: {
                type: DataTypes.STRING,
                allowNull:true
            },
            permanentAddress1: {
                type: DataTypes.TEXT,
                allowNull:true
            },
            permanentCountry: {
                type: DataTypes.STRING,
                allowNull:true
            },
            permanentState: {
                type: DataTypes.STRING,
                allowNull:true
            },
            permanentCity: {
                type: DataTypes.STRING,
                allowNull:true
            },
            permanentPostalCode: {
                type: DataTypes.STRING,
                allowNull:true
            },
            passportNumber: {
                type: DataTypes.STRING,
                allowNull:true
            },
            passportIssueDate: {
                type: DataTypes.STRING,
                allowNull:true
            },
            passportExpiryDate: {
                type: DataTypes.STRING,
                allowNull:true
            },
            passportIssueCountry: {
                type: DataTypes.STRING,
                allowNull:true
            },
            passportCityOfBirth: {
                type: DataTypes.STRING,
                allowNull:true
            },
            passportCountryOfBirth: {
                type: DataTypes.STRING,
                allowNull:true
            },
            nationlity: {
                type: DataTypes.STRING,
                allowNull:true
            },
            citizenship: {
                type: DataTypes.STRING,
                allowNull:true
            },
            isMultiCitizenship: {
                type: DataTypes.STRING,
                allowNull:true
            },
            isStudyOrLivingOtherCountry: {
                type: DataTypes.STRING,
                allowNull:true
            },
            isAppliedAnyImmigrationBefore: {
                type: DataTypes.STRING,
                allowNull:true
            },
            isSeriousMedicalCondition: {
                type: DataTypes.STRING,
                allowNull:true
            },
            isVisaRefusal: {
                type: DataTypes.STRING,
                allowNull:true
            },
            isCriminalOffence: {
                type: DataTypes.STRING,
                allowNull:true
            },
            emergencyContactName: {
                type: DataTypes.STRING,
                allowNull:true
            },
            emergencyContactPhone: {
                type: DataTypes.STRING,
                allowNull:true
            },
            emergencyContactEmail: {
                type: DataTypes.STRING,
                allowNull:true
            },
            emergencyContactRelation: {
                type: DataTypes.STRING,
                allowNull:true
            },
            gapDetails: {
                type: DataTypes.TEXT,
                allowNull:true
            },
        }
    )

    return Profile;
}