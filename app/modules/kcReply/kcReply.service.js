const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const NotificationService = require("../notification/notification.service");
const KCReply = db.kcReply;
const User = db.user;
const Notification = db.notification;

const insertIntoDB = async (payload) => {
  const { userId, user_id, application_id} = payload;

  const result = await KCReply.create(payload);

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
    message: `${management.FirstName} ${management.LastName} reply for ${user.FirstName} ${user.LastName} in application ${application_id}`,
    branch: user.Branch,
    url: `app/editprofile/${user.id}`,
    userId: user_id,
  };

  await NotificationService.createNotification(notificationData);

  return result;
};

const getAllFromDB = async () => {
  const result = await KCReply.findAll();

  return result;
};

const getDataById = async (id) => {
  console.log("dataid", id);
  const result = await KCReply.findOne({
    where: {
      user_id: id,
    },
  });

  return result;
};

const deleteIdFromDB = async (id) => {
  const result = await KCReply.destroy({
    where: {
      id: id,
    },
  });

  return result;
};

const updateOneFromDB = async (id, payload) => {
  console.log("academic", data);

  const result = await KCReply.update(data, {
    where: {
      user_id: id,
    },
  });

  return result;
};

const KCReplyService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = KCReplyService;
