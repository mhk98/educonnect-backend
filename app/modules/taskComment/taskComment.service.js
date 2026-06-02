// const db = require("../../../../models");
// const ApiError = require("../../../error/ApiError");

// const TaskComment = db.taskComment;

// const createComment = async (payload) => {
//   return await TaskComment.create(payload);
// };

// const getCommentsByTask = async (task_id) => {
//   return await TaskComment.findAll({
//     where: { task_id },
//     include: [
//       {
//         model: db.user,
//         attributes: ["id", "FirstName", "LastName", "image"],
//       },
//     ],
//     order: [["createdAt", "ASC"]],
//   });
// };

// const updateComment = async (id, user_id, role, message) => {
//   const comment = await TaskComment.findByPk(id);
//   if (!comment) throw new ApiError(404, "Comment not found");

//   if (
//     comment.user_id !== user_id &&
//     role !== "admin" &&
//     role !== "superAdmin"
//   ) {
//     throw new ApiError(403, "Permission denied");
//   }

//   return await comment.update({ message });
// };

// const deleteComment = async (id, user_id, role) => {
//   const comment = await TaskComment.findByPk(id);
//   if (!comment) throw new ApiError(404, "Comment not found");

//   if (
//     comment.user_id !== user_id &&
//     role !== "admin" &&
//     role !== "superAdmin"
//   ) {
//     throw new ApiError(403, "Permission denied");
//   }

//   await comment.destroy();
// };

// module.exports = {
//   createComment,
//   getCommentsByTask,
//   updateComment,
//   deleteComment,
// };

const db = require("../../../models");
const ApiError = require("../../../error/ApiError");

// 🔥 NEW IMPORTS
const { extractMentions } = require("../../utils/mention");

const { resolveMentionedUsers } = require("../services/mention.service");
const { logActivity } = require("../taskActivity/taskActivity.service");

const TaskComment = db.taskComment;
const Notification = db.notification;
const Task = db.task;
const User = db.user;

/**
 * =========================
 * CREATE COMMENT
 * =========================
 */
// const createComment = async ( task_id, data) => {

//   const {user_id, message, branch} = data;

//   // 1️⃣ create comment
//   const comment = await TaskComment.create({
//     task_id,
//     user_id,
//     message,
//   });

//   // 2️⃣ activity log: comment added
//   await logActivity({
//     task_id,
//     user_id,
//     action: "COMMENT_ADDED",
//   });

//   // 3️⃣ 🔥 mention handling
//   const mentions = extractMentions(message);

//   if (mentions.length) {
//     const mentionedUsers = await resolveMentionedUsers(mentions);

//     for (const user of mentionedUsers) {
//       // activity log
//       await logActivity({
//         task_id,
//         user_id,
//         action: "MENTIONED",
//         meta: { mentionedUserId: user.id },
//       });

//       console.log("mentionInfo", user)
//       // notification
//       await Notification.create({
//         userId: user.id,
//         branch,
//         message: "You were mentioned in a task comment",
//         url: `task/${task_id}`,
//       });
//     }
//   }

//   return comment;
// };

const createComment = async (data) => {
  const { task_id, user_id, message, branch } = data;

  if (!task_id) throw new ApiError(400, "Task ID is required");
  if (!user_id) throw new ApiError(400, "User ID is required");

  const task = await Task.findOne({
    where: {
      id:task_id
    }
  });
  if (!task) throw new ApiError(404, "Task not found");

  const user = await User.findOne({
    where: {
      id:user_id
    }
  });
  if (!user) throw new ApiError(404, "User not found");

  console.log("data", data)
  console.log("task_id", task_id)


  const comment = await TaskComment.create({
    task_id,
    user_id,
    message,
  });

  await logActivity({
    task_id,
    user_id,
    action: "COMMENT_ADDED",
  });

  const mentions = extractMentions(message);

  if (mentions.length) {
    const mentionedUsers = await resolveMentionedUsers(mentions);

    for (const mentionedUser of mentionedUsers) {
      await logActivity({
        task_id,
        user_id,
        action: "MENTIONED",
        meta: { mentionedUserId: mentionedUser.id },
      });

      await Notification.create({
        userId: mentionedUser.id,
        branch,
        message: "You were mentioned in a task comment",
        url: `task/${task_id}`,
      });
    }
  }

  return comment;
};

/**
 * =========================
 * GET COMMENTS BY TASK
 * =========================
 */
const getCommentsByTask = async (task_id) => {
  return await TaskComment.findAll({
    where: { task_id },
    include: [
      {
        model: db.user,
        attributes: ["id", "FirstName", "LastName", "image"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

/**
 * =========================
 * UPDATE COMMENT
 * =========================
 */
const updateComment = async (id, data) => {
  const { user_id, message, role, branch } = data;
  const comment = await TaskComment.findByPk(id);

  if (!comment) throw new ApiError(404, "Comment not found");

  if (
    comment.user_id !== user_id &&
    role !== "admin" &&
    role !== "superAdmin"
  ) {
    throw new ApiError(403, "Permission denied");
  }

  // 🔍 detect new mentions only
  const oldMentions = extractMentions(comment.message);
  const newMentions = extractMentions(message);
  const addedMentions = newMentions.filter((m) => !oldMentions.includes(m));

  await comment.update({ message });

  // activity log
  await logActivity({
    task_id: comment.task_id,
    user_id,
    action: "COMMENT_EDITED",
  });

  // 🔥 mention handling (only newly added)
  if (addedMentions.length) {
    const mentionedUsers = await resolveMentionedUsers(addedMentions);

    for (const user of mentionedUsers) {
      await logActivity({
        task_id: comment.task_id,
        user_id,
        action: "MENTIONED",
        meta: { mentionedUserId: user.id },
      });

      await createNotification({
        userId: user.id,
        message: "You were mentioned in an updated task comment",
        branch,
        url: `task/${comment.task_id}`,
      });
    }
  }

  return comment;
};

/**
 * =========================
 * DELETE COMMENT
 * =========================
 */
const deleteComment = async (id, user_id, role) => {
  const comment = await TaskComment.findByPk(id);
  if (!comment) throw new ApiError(404, "Comment not found");

  if (
    comment.user_id !== user_id &&
    role !== "admin" &&
    role !== "superAdmin"
  ) {
    throw new ApiError(403, "Permission denied");
  }

  await comment.destroy();

  // activity log
  await logActivity({
    task_id: comment.task_id,
    user_id,
    action: "COMMENT_DELETED",
  });
};

const TaskCommentService = {
  createComment,
  getCommentsByTask,
  updateComment,
  deleteComment,
};

module.exports = TaskCommentService;
