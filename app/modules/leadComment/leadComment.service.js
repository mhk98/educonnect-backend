const { Op } = require("sequelize");
const db = require("../../../models");
const LeadComment = db.leadComment;
const LeadReply = db.leadReply;
const User = db.user;
const NotificationService = require("../notification/notification.service");
const ApiError = require("../../../error/ApiError");
const Consultation = db.consultation;

// Insert new comment
const insertIntoDB = async (data) => {
  const { user_id, lead_id, location } = data;
  console.log("leadComment", data);
  const result = await LeadComment.create(data);

  if (!result) {
    throw new ApiError(400, "Failed to create lead comment");
  }

  const lead = await Consultation.findOne({
    where: {
      id: lead_id,
    },
  });

  const notificationData = {
    message: `New comment for ${location} branch lead ${lead.fullName}`,
    branch: location,
    url: `lead/${lead_id}`,
    userId: user_id,
  };

  await NotificationService.createNotification(notificationData);

  return result;
};

// Fetch all comments for an application (with replies and user info)
// const getDataById = async (lead_id) => {
//   // Build the query where condition

//   const result = await LeadComment.findAll({
//     where: { lead_id },
//     include: [
//       { model: User, attributes: ["id", "FirstName", "LastName"] },
//       {
//         model: LeadReply,
//         as: "LeadReplies", // <--- must match the alias used in association
//         include: [{ model: User, attributes: ["id", "FirstName", "LastName"] }],
//       },
//     ],
//     order: [["createdAt", "ASC"]],
//   });

//   return result;
// };

const getDataById = async (lead_id) => {
  const result = await LeadComment.findAll({
    where: { lead_id },
    include: [
      {
        model: User,
        attributes: ["id", "FirstName", "LastName"],
      },
      {
        model: LeadReply,
        as: "leadReplies", // must match association
        include: [
          {
            model: User,
            attributes: ["id", "FirstName", "LastName"],
          },
        ],
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  return result;
};

// Placeholder in case getAllFromDB is used elsewhere
const getAllFromDB = async () => {
  return await LeadComment.findAll();
};

const LeadCommentService = {
  insertIntoDB,
  getDataById,
  getAllFromDB,
};

module.exports = LeadCommentService;
