const { Op } = require("sequelize");
const db = require("../../../models");
const StudentComment = db.studentComment;
const StudentReply = db.studentReply;
const User = db.user;
const Notification = db.notification;
const NotificationService = require("../notification/notification.service");
const ApiError = require("../../../error/ApiError");

// Insert new comment
const insertIntoDB = async (data) => {
  const { user_id, userId, application_id } = data;

  const result = await StudentComment.create(data);

  if (!result) {
    throw new ApiError(400, "Failed to create comment");
  }
  const user = await User.findOne({ where: { id: user_id } });
  if (!user) {
    throw new Error("User not found.");
  }

  console.log("Role", user.Role);

  if (user.Role === "student") {
    const notificationData = {
      message: ` ${user.FirstName} ${user.LastName} comment in application ${application_id}`,
      branch: user.Branch,
      url: `editprofile/${user.id}`,
      userId: user.id,
    };

    await NotificationService.createNotification(notificationData);
  } else {
    await Notification.create({
      message: ` ${user.FirstName} ${user.LastName} comment in application ${application_id}`,
      branch: user.Branch,
      url: `editprofile/${user.id}`,
      userId: userId,
    });
  }

  return result;
};

// Fetch all comments for an application (with replies and user info)
const getDataById = async (application_id, type) => {
  // Build the query where condition
  const whereCondition = { application_id };

  // If the "tab" type is provided, filter by it (e.g., "kc" or "student")
  if (type) {
    whereCondition.type = type; // Assuming your `StudentComment` model has a `type` field
  }

  const result = await StudentComment.findAll({
    where: { application_id },
    include: [
      { model: User, attributes: ["id", "FirstName", "LastName"] },
      {
        model: StudentReply,
        as: "studentReplies", // <--- must match the alias used in association
        include: [{ model: User, attributes: ["id", "FirstName", "LastName"] }],
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  return result;
};

// Placeholder in case getAllFromDB is used elsewhere
const getAllFromDB = async () => {
  return await StudentComment.findAll();
};

const StudentCommentService = {
  insertIntoDB,
  getDataById,
  getAllFromDB,
};

module.exports = StudentCommentService;
