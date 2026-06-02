const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const StudentReply = db.studentReply;
const User = db.user;
const Notification = db.notification;
const NotificationService = require("../notification/notification.service");

const insertIntoDB = async (data) => {
  const { user_id, userId, application_id } = data;

  const result = await StudentReply.create(data);

  if (!result) {
    throw new ApiError(400, "Failed to create test");
  }

  const user = await User.findOne({ where: { id: user_id } });
  if (!user) {
    throw new Error("User not found.");
  }

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

const getAllFromDB = async () => {
  const result = await StudentReply.findAll();

  return result;
};

const getDataById = async (id) => {
  console.log("dataid", id);
  const result = await StudentReply.findOne({
    where: {
      user_id: id,
    },
  });

  return result;
};

const deleteIdFromDB = async (id) => {
  const result = await StudentReply.destroy({
    where: {
      id: id,
    },
  });

  return result;
};

const updateOneFromDB = async (id, payload) => {
  console.log("academic", data);

  const result = await StudentReply.update(data, {
    where: {
      user_id: id,
    },
  });

  return result;
};

const StudentReplyService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = StudentReplyService;
