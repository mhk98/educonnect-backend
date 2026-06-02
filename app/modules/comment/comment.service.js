const { Op } = require("sequelize");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const NotificationService = require("../notification/notification.service");
const Comment = db.comment;
const Reply = db.reply;
const User = db.user;
const Enquiries = db.enquiries;

// Insert new comment
const insertIntoDB = async (data) => {
  const { enquiry_id, user_id } = data;

  const result = await Comment.create(data);

    const enquiry = await Enquiries.findOne({
    where: {
      id: enquiry_id,
    },
  });

  if (!enquiry) {
    throw new ApiError(400, "Enquiry not found");
  }

  const user = await User.findOne({
    where: {
      id: user_id,
    },
  });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  if (!result) {
    throw new ApiError(400, "Failed to create task.");
  }

  const notificationData = {
    message: `${user.FirstName} ${user.LastName} comment for this ${enquiry.firstName} ${enquiry.lastName} enquiry student`,
    branch: enquiry.Branch,
    url: "manage-enquiries",
    userId: user_id,
  };

  await NotificationService.createNotification(notificationData);

  return result;
};

// Fetch all comments for an application (with replies and user info)
const getDataById = async (enquiry_id, type) => {
  // Build the query where condition
  const whereCondition = { enquiry_id };

  // If the "tab" type is provided, filter by it (e.g., "kc" or "student")
  if (type) {
    whereCondition.type = type; // Assuming your `Comment` model has a `type` field
  }

  const result = await Comment.findAll({
    where: { enquiry_id },
    include: [
      { model: User, attributes: ["id", "FirstName", "LastName"] },
      {
        model: Reply,
        as: "replies", // <--- must match the alias used in association
        include: [{ model: User, attributes: ["id", "FirstName", "LastName"] }],
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  return result;
};

// Placeholder in case getAllFromDB is used elsewhere
const getAllFromDB = async () => {
  return await Comment.findAll();
};

const CommentService = {
  insertIntoDB,
  getDataById,
  getAllFromDB,
};

module.exports = CommentService;
