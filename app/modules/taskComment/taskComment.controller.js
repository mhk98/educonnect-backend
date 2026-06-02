const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const TaskCommentService = require("./taskComment.service");
const ApiError = require("../../../error/ApiError");

// const addComment = catchAsync(async (req, res) => {
//   const task_id = Number(req.params.taskId);

//   const { user_id, message, branch } = req.body;

//   console.log("task_id", task_id);
//   console.log("task_comment", req.body);

//   const data = {
//     user_id,
//     message,
//     branch,
//   };
//   const result = await TaskCommentService.createComment(task_id, data);

//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: "Comment added",
//     data: result,
//   });
// });

const addComment = catchAsync(async (req, res) => {
  const task_id = Number(req.params.taskId);
  const { user_id, message, branch } = req.body;

  if (!task_id) throw new ApiError(400, "Task ID missing");
  if (!user_id) throw new ApiError(400, "User ID missing");
  if (!message) throw new ApiError(400, "Message required");

  const result = await TaskCommentService.createComment({
    task_id,
    user_id,
    message,
    branch,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Comment added",
    data: result,
  });
});

const getComments = catchAsync(async (req, res) => {
  const result = await TaskCommentService.getCommentsByTask(req.params.taskId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
  });
});

const editComment = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { user_id, message, role, branch } = req.body;

  const data = {
    user_id,
    message,
    role,
    branch,
  };

  const result = await TaskCommentService.updateComment(id, data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment updated",
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  await TaskCommentService.deleteComment(
    req.params.id,
    req.body.user_id,
    req.body.role,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment deleted",
  });
});

module.exports = {
  addComment,
  getComments,
  editComment,
  deleteComment,
};
