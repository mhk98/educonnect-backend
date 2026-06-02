const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const Profile = db.profile;

const insertIntoDB = async (data) => {
  const result = await Profile.create(data);

  // console.log('result', result)
  return result;
};

const getAllFromDB = async () => {
  const result = await Profile.findAll();

  return result;
};

const getDataById = async (id) => {
  const result = await Profile.findOne({
    where: {
      user_id: id,
    },
  });

  return result;
};

const deleteIdFromDB = async (id) => {
  const result = await Profile.destroy({
    where: {
      id: id,
    },
  });

  return result;
};

const updateOneFromDB = async (id, payload) => {
  // image: req.file === undefined ? undefined : req.file.path,

  const {
    dob,
    gender,
    maritalStatus,
    mailingAddress1,
    mailingAddress2,
    mailingCountry,
    mailingState,
    mailingCity,
    mailingPostalCode,
    permanentAddress1,
    permanentAddress2,
    permanentCountry,
    permanentState,
    permanentCity,
    permanentPostalCode,
    passportNumber,
    passportIssueDate,
    passportExpiryDate,
    passportIssueCountry,
    passportCityOfBirth,
    passportCountryOfBirth,
    nationlity,
    citizenship,
    isMultiCitizenship,
    isStudyOrLivingOtherCountry,
    isAppliedAnyImmigrationBefore,
    isSeriousMedicalCondition,
    isVisaRefusal,
    isCriminalOffence,
    emergencyContactName,
    emergencyContactPhone,
    emergencyContactEmail,
    emergencyContactRelation,
    gapDetails,
  } = payload;

  const data = {
    dob: dob === "" ? undefined : dob,
    gender: gender === "" ? undefined : gender,
    maritalStatus: maritalStatus === "" ? undefined : maritalStatus,
    mailingAddress1: mailingAddress1 === "" ? undefined : mailingAddress1,
    mailingAddress2: mailingAddress2 === "" ? undefined : mailingAddress2,
    mailingCountry: mailingCountry === "" ? undefined : mailingCountry,
    mailingState: mailingState === "" ? undefined : mailingState,
    mailingCity: mailingCity === "" ? undefined : mailingCity,
    mailingPostalCode: mailingPostalCode === "" ? undefined : mailingPostalCode,
    permanentAddress1: permanentAddress1 === "" ? undefined : permanentAddress1,
    permanentAddress2: permanentAddress2 === "" ? undefined : permanentAddress2,
    permanentCountry: permanentCountry === "" ? undefined : permanentCountry,
    permanentState: permanentState === "" ? undefined : permanentState,
    permanentCity: permanentCity === "" ? undefined : permanentCity,
    permanentPostalCode:
      permanentPostalCode === "" ? undefined : permanentPostalCode,
    passportNumber: passportNumber === "" ? undefined : passportNumber,
    passportIssueDate: passportIssueDate === "" ? undefined : passportIssueDate,
    passportExpiryDate:
      passportExpiryDate === "" ? undefined : passportExpiryDate,
    passportIssueCountry:
      passportIssueCountry === "" ? undefined : passportIssueCountry,
    passportCityOfBirth:
      passportCityOfBirth === "" ? undefined : passportCityOfBirth,
    passportCountryOfBirth:
      passportCountryOfBirth === "" ? undefined : passportCountryOfBirth,
    nationlity: nationlity === "" ? undefined : nationlity,
    citizenship: citizenship === "" ? undefined : citizenship,
    isMultiCitizenship:
      isMultiCitizenship === "" ? undefined : isMultiCitizenship,
    isStudyOrLivingOtherCountry:
      isStudyOrLivingOtherCountry === ""
        ? undefined
        : isStudyOrLivingOtherCountry,
    isAppliedAnyImmigrationBefore:
      isAppliedAnyImmigrationBefore === ""
        ? undefined
        : isAppliedAnyImmigrationBefore,
    isSeriousMedicalCondition:
      isSeriousMedicalCondition === "" ? undefined : isSeriousMedicalCondition,
    isVisaRefusal: isVisaRefusal === "" ? undefined : isVisaRefusal,
    isCriminalOffence: isCriminalOffence === "" ? undefined : isCriminalOffence,
    emergencyContactName:
      emergencyContactName === "" ? undefined : emergencyContactName,
    emergencyContactPhone:
      emergencyContactPhone === "" ? undefined : emergencyContactPhone,
    emergencyContactEmail:
      emergencyContactEmail === "" ? undefined : emergencyContactEmail,
    emergencyContactRelation:
      emergencyContactRelation === "" ? undefined : emergencyContactRelation,
    gapDetails: gapDetails === "" ? undefined : gapDetails,
  };

  console.log("payload", data);
  const result = await Profile.update(data, {
    where: {
      user_id: id,
    },
  });

  return result;
};

const ProfileService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = ProfileService;
