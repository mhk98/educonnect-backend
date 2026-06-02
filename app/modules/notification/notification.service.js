// notification.service.js
const { Op } = require("sequelize");
const db = require("../../../models");
const paginationHelpers = require("../../../helpers/paginationHelper");
const Notification = db.notification;
const User = db.user;

// 🔹 Get notifications for a specific user
// const getNotificationByUser = async (branch) => {
//   const queryBranch = branch ? branch.toLowerCase().trim() : "";

//   return await Notification.findAll({
//     where: { branch: queryBranch },
//     order: [["createdAt", "DESC"]],
//   });
// };

// 🔹 Get all notifications (userId optional, branch+role match)
const getNotificationByUser = async (payload, options) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  // Destructuring is correct, but let's ensure the values are ready for the query
  const { branch, userId } = payload;

  // *** IMPORTANT: Sanitize and standardize the input for the WHERE clause ***
  const queryBranch = branch ? branch.toLowerCase().trim() : "";

  const result = await Notification.findAll({
    where: {
      // Use the standardized variables for the query
      branch: queryBranch,
      userId: userId,
    },
    offset: skip,
    limit,
    order: [["createdAt", "DESC"]],
  });

  let total = await Notification.count({
    where: {
      branch: queryBranch,
      userId: userId,
    },
  });

  return {
    meta: { total, page, limit },
    data: result,
  };
};

// // 🔹 Create notification for all users in branch + role
// const createNotification = async ({ message, branch, url, userId }) => {
//   // 1️⃣ Find all users matching branch
//   const users = await User.findAll({ where: { Branch: branch } });

//   console.log("location users", users);
//   // 2️⃣ Create notification row for each user
//   const notifications = await Promise.all(
//     users.map((user) =>
//       Notification.create({
//         userId: user.id,
//         message,
//         branch,
//         url,
//       })
//     )
//   );

//   console.log("notifications", notifications);
//   return notifications;
// };

// 🔹 Create notification for all users in branch except given userId
// const createNotification = async ({ message, branch, url, userId }) => {
//   // 1️⃣ Find all users in the branch except the one with userId

//   console.log("notifiactionInfo", message, branch, url, userId);
//   const users = await User.findAll({
//     where: {
//       Branch: branch,
//       Role: { [Op.ne]: "student" }, // 👈 Only non-students
//       id: { [Op.ne]: userId },
//     },
//   });

//   console.log("Target users (excluding sender):", users.length);

//   if (!users.length) {
//     console.log("No users found in this branch (excluding sender).");
//     return [];
//   }

//   // 2️⃣ Create notification for each remaining user
//   const notifications = await Promise.all(
//     users.map((user) =>
//       Notification.create({
//         userId: user.id,
//         message,
//         branch,
//         url,
//       })
//     )
//   );

//   console.log("Notifications created:", notifications.length);
//   return notifications;
// };

const createNotification = async ({ message, branch, url, userId }) => {
  console.log("notificationInfo", message, branch, url, userId);

  const users = await User.findAll({
    where: {
      [Op.or]: [
        { Branch: "Edu Anchor" }, // 🔹 Edu Anchor branch
        { Branch: branch }, // 🔹 ইনপুট branch
      ],
      Role: { [Op.ne]: "student" }, // 👈 Only non-students
      id: { [Op.ne]: userId }, // 👈 Exclude sender
    },
  });

  console.log("Target users:", users);

  if (!users.length) {
    console.log("No users found for notification.");
    return [];
  }

  const notifications = await Promise.all(
    users.map((user) =>
      Notification.create({
        userId: user.id,
        message,
        branch: user.Branch,
        url,
      })
    )
  );

  console.log("Notifications created:", notifications.length);
  return notifications;
};

// 🔹 Mark notification as read for specific user
const markAsReadNotification = async (id, userId) => {
  const notif = await Notification.findOne({
    where: { id, userId },
  });

  if (!notif) return null;

  notif.isRead = true;
  await notif.save();
  return notif;
};

const NotificationService = {
  getNotificationByUser,
  createNotification,
  markAsReadNotification,
};

module.exports = NotificationService;
