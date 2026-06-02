const { Op } = require("sequelize");
const db = require("../../../models");
const NotificationService = require("../notification/notification.service");
const KCComment = db.kcComment;
const KCReply = db.kcReply;
const User = db.user;
const Notification = db.notification;

// Insert new comment
const insertIntoDB = async (payload) => {
  const { userId, user_id, application_id, text, type } = payload;

  console.log("payload", payload);
  const result = await KCComment.create(payload);

  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found.");
  }

  const management = await User.findOne({ where: { id: user_id } });
  if (!management) {
    throw new Error("Management not found.");
  }

  // -------- 2️⃣ Prepare Notification --------
  const notificationData = {
    message: `${management.FirstName} ${management.LastName} message for ${user.FirstName} ${user.LastName} in application ${application_id}`,
    branch: user.Branch,
    url: `editprofile/${user.id}`,
    userId: user_id,
  };

  await NotificationService.createNotification(notificationData);

  return result;
};

// Fetch all comments for an application (with replies and user info)
const getDataById = async (application_id, type) => {
  // Build the query where condition
  const whereCondition = { application_id };

  // If the "tab" type is provided, filter by it (e.g., "kc" or "student")
  if (type) {
    whereCondition.type = type; // Assuming your `KCComment` model has a `type` field
  }

  const result = await KCComment.findAll({
    where: { application_id },
    include: [
      { model: User, attributes: ["id", "FirstName", "LastName"] },
      {
        model: KCReply,
        as: "kcReplies", // <--- must match the alias used in association
        include: [{ model: User, attributes: ["id", "FirstName", "LastName"] }],
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  return result;
};

// Placeholder in case getAllFromDB is used elsewhere
const getAllFromDB = async () => {
  return await KCComment.findAll();
};

const KCCommentService = {
  insertIntoDB,
  getDataById,
  getAllFromDB,
};

module.exports = KCCommentService;
