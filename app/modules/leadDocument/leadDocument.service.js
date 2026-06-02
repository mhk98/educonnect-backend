const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const LeadDocument = db.leadDocument;
const NotificationService = require("../notification/notification.service");
const Consultation = db.consultation;

const insertIntoDB = async (info, filePath) => {
  const { lead_id, user_id, location } = info;

  const leadId = parseInt(lead_id, 10);
  if (isNaN(leadId)) {
    throw new ApiError(400, `Invalid lead_id: ${lead_id}`);
  }

  const data = {
    ...info,
    lead_id: leadId,
    user_id: user_id,
    file: filePath,
  };

  console.log("Data being inserted:", data);

  const result = await LeadDocument.create(data);

  if (!result) {
    throw new ApiError(400, "Failed to create lead documment");
  }

  const lead = await Consultation.findOne({
    where: {
      id: leadId,
    },
  });

  const notificationData = {
    message: `New document upload for ${location} branch lead ${lead.fullName}`,
    branch: location,
    url: `lead/${leadId}`,
    userId: user_id,
  };

  await NotificationService.createNotification(notificationData);

  return result;
};

const getAllFromDB = async (id) => {
  const result = await LeadDocument.findAll({
    where: {
      lead_id: id,
    },
  });

  return result;
};

// const getDataById = async (id) => {

//   console.log("dataid", id)
//   const result = await LeadDocument.findOne(
//    {
//     where:{
//       id:id
//     }
//    }
// )

//   return result
// };

const deleteIdFromDB = async (id) => {
  const result = await LeadDocument.destroy({
    where: {
      id: id,
    },
  });

  return result;
};

const updateOneFromDB = async (id, payload) => {
  console.log("payload", payload);

  const result = await LeadDocument.update(payload, {
    where: {
      id: id,
    },
  });

  return result;
};

const AdditionalLeadDocumentService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  // getDataById,
};

module.exports = AdditionalLeadDocumentService;
