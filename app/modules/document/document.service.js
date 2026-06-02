const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const Document = db.document;

const insertIntoDB = async (data) => {
  const result = await Document.create(data);

  console.log("Document", result);
  return result;
};

const getAllFromDB = async () => {
  const result = await Document.findAll();

  return result;
};

const getDataById = async (id) => {
  console.log("dataid", id);
  const result = await Document.findOne({
    where: {
      user_id: id,
    },
  });

  return result;
};

const deleteIdFromDB = async (id) => {
  const result = await Document.destroy({
    where: {
      id: id,
    },
  });

  return result;
};

const updateOneFromDB = async (id, payload) => {
  const {
    tenthMarksheet,
    tenthCertificate,
    twelveMarksheet,
    twelveCertificate,
    bachelorCertificate,
    bachelorTranscript,
    passport,
    essay,
    instructionLetter,
  } = payload;
  console.log(payload);
  const data = {
    tenthMarksheet: tenthMarksheet && tenthMarksheet[0].path,
    tenthCertificate: tenthCertificate && tenthCertificate[0].path,
    twelveMarksheet: twelveMarksheet && twelveMarksheet[0].path,
    twelveCertificate: twelveCertificate && twelveCertificate[0].path,
    passport: passport && passport[0].path,
    essay: essay && essay[0].path,
    instructionLetter: instructionLetter && instructionLetter[0].path,
    bachelorCertificate: bachelorCertificate && bachelorCertificate[0].path,
    bachelorTranscript: bachelorTranscript && bachelorTranscript[0].path,
  };

  console.log("document", data);

  const result = await Document.update(data, {
    where: {
      user_id: id,
    },
  });

  return result;
};

const DocumentService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = DocumentService;
