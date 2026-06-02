const { Op, where } = require("sequelize"); // Ensure Op is imported
const db = require("../../../models");
const LeadReply = db.leadReply;
const NotificationService = require("../notification/notification.service");
const ApiError = require("../../../error/ApiError");
const Consultation = db.consultation;

const insertIntoDB = async (data) => {
  const { user_id, lead_id, location } = data;

  const result = await LeadReply.create(data);

  if (!result) {
    throw new ApiError(400, "Failed to create lead reply");
  }

  const lead = await Consultation.findOne({
        where: {
          id: lead_id,
        },
      });

  const notificationData = {
    message: `New reply for ${location} branch lead ${lead.fullName}`,
    branch: location,
    url: `lead/${lead_id}`,
    userId: user_id,
  };

  await NotificationService.createNotification(notificationData);

  return result;
};

const getAllFromDB = async () => {
  const result = await LeadReply.findAll();

  return result;
};

const getDataById = async (id) => {
  console.log("dataid", id);
  const result = await LeadReply.findOne({
    where: {
      user_id: id,
    },
  });

  return result;
};

const deleteIdFromDB = async (id) => {
  const result = await LeadReply.destroy({
    where: {
      id: id,
    },
  });

  return result;
};

const updateOneFromDB = async (id, payload) => {
  console.log("academic", data);

  const result = await LeadReply.update(data, {
    where: {
      user_id: id,
    },
  });

  return result;
};

const LeadReplyService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = LeadReplyService;
