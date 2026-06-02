// const catchAsync = require("../../../shared/catchAsync");
// const sendResponse = require("../../../shared/sendResponse");
// const TaskService = require("./task.service");
// const db = require("../../../models");
// const ApiError = require("../../../error/ApiError");
// const { TaskFilterAbleFileds } = require("./task.constants");
// const pick = require("../../../shared/pick");
// const NotificationEmail = require("../../middlewares/notificationEmail");
// const User = db.user;
// const Notification = db.notification;

// const insertIntoDB = catchAsync(async (req, res) => {
//   const { assignor, task, description, comment, id, user_id, branch, dueDate } =
//     req.body;

//   const user = await User.findOne({
//     where: {
//       id: id,
//     },
//   });

//   if (!user) {
//     throw new ApiError(400, "User not found");
//   }

//   const sender = await User.findOne({
//     where: {
//       id: user_id,
//     },
//   });

//   if (!sender) {
//     throw new ApiError(400, "Sender not found");
//   }

//   const data = {
//     assignor,
//     task,
//     dueDate,
//     description,
//     comment,
//     assignedTo: `${user.FirstName} ${user.LastName}`,
//     assignedTo_id: user.id,
//     user_id,
//     branch,
//     file: req.file ? req.file.path : undefined,
//   };

//   const result = await TaskService.insertIntoDB(data);

//   if (!result) {
//     throw new Error("Failed to create task.");
//   }

//   const notificationData = {
//     message: `Task for you from ${assignor}`,
//     branch: branch,
//     url: "task",
//     userId: id,
//   };

//   const notificationResult = await Notification.create(notificationData);

//   if (!notificationResult) {
//     throw new Error("Failed to create notification.");
//   }

//   await NotificationEmail({
//     from: sender.Email,
//     to: user.Email,
//     subject: `New Task Assigned: ${task}`,
//     htmlContent: `<p>Dear ${user.FirstName},</p>
//     <p>You have been assigned a new task by ${assignor}.</p>`,
//   });

//   // 🔔 Emit notification to assigned user only
//   if (req.io) {
//     req.io.to(user.id.toString()).emit("task-assigned", {
//       message: `A new task "${task}" has been assigned to you`,
//       task: result,
//     });
//   }

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Task successfully created!!",
//     data: result,
//   });
// });

// const getAllFromDB = catchAsync(async (req, res) => {
//   const filters = pick(req.query, TaskFilterAbleFileds);
//   const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

//   console.log("filters", filters);
//   const result = await TaskService.getAllFromDB(filters, options);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Task data fetched!!",
//     meta: result.meta,
//     data: result.data,
//   });
// });

// const getAllDataById = catchAsync(async (req, res) => {
//   const { user_id } = req.params;

//   const result = await TaskService.getAllDataById(user_id);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Task data fetch!!",
//     data: result,
//   });
// });

// const updateOneFromDB = catchAsync(async (req, res) => {
//   const { id } = req.params;

//   const {
//     assignor,
//     assignedTo,
//     task,
//     description,
//     status,
//     user_id,
//     comment,
//     branch,
//     dueDate,
//     assignedTo_id,
//   } = req.body;

//   const data = {
//     assignor: assignor === "" ? undefined : assignor,
//     assignedTo: assignedTo === "" ? undefined : assignedTo,
//     task: task === "" ? undefined : task,
//     assignedTo_id: assignedTo_id === "" ? undefined : assignedTo_id,
//     description: description === "" ? undefined : description,
//     status: status === "" ? undefined : status,
//     comment: comment === "" ? undefined : comment,
//     branch: branch === "" ? undefined : branch,
//     dueDate: dueDate === "" ? undefined : dueDate,
//     user_id: user_id === "" ? undefined : user_id,
//     file: req.file ? req.file.path : undefined,
//   };

//   const result = await TaskService.updateOneFromDB(id, data);

//   if (!result) {
//     throw new Error("Failed to create task.");
//   }

//   const notificationData = {
//     message: `Update your task from ${assignor}`,
//     branch: branch,
//     url: "task",
//     userId: user_id,
//   };

//   await Notification.create(notificationData);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Task update successfully!!",
//     data: result,
//   });
// });

// const deleteIdFromDB = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   console.log("deleteId", id);

//   const result = await TaskService.deleteIdFromDB(id);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Task delete successfully!!",
//     data: result,
//   });
// });

// const TaskController = {
//   getAllFromDB,
//   getAllDataById,
//   insertIntoDB,
//   deleteIdFromDB,
//   updateOneFromDB,
// };

// module.exports = TaskController;

const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const TaskService = require("./task.service");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const { TaskFilterAbleFileds } = require("./task.constants");
const pick = require("../../../shared/pick");
const NotificationEmail = require("../../middlewares/notificationEmail");

const User = db.user;
const Notification = db.notification;

// const insertIntoDB = catchAsync(async (req, res) => {
//   const {
//     assignor,
//     task,
//     description,
//     comment,
//     id,
//     student_id,
//     user_id,
//     branch,
//     dueDate,
//     priority,
//   } = req.body;

//   const user = await User.findOne({ where: { id } });
//   if (!user) throw new ApiError(400, "User not found");

//   const sender = await User.findOne({ where: { id: user_id } });
//   if (!sender) throw new ApiError(400, "Sender not found");

//   const uploadedFiles = req.files?.map((file) => ({
//     filename: file.filename,
//     path: file.path,
//     mimetype: file.mimetype,
//     size: file.size,
//   }));

//   console.log("files", uploadedFiles);
//   const data = {
//     assignor,
//     task,
//     student_id: student_id || null,
//     priority,
//     dueDate,
//     description,
//     comment,
//     assignedTo: `${user.FirstName} ${user.LastName}`,
//     assignedTo_id: user.id,
//     user_id,
//     branch,
//     files: uploadedFiles,
//   };

//   console.log(data);

//   const result = await TaskService.insertIntoDB(data);

//   await Notification.create({
//     message: `Task for you from ${assignor}`,
//     branch,
//     url: "task",
//     userId: id,
//   });

//   await NotificationEmail({
//     from: sender.Email,
//     to: user.Email,
//     subject: `New Task Assigned: ${task}`,
//     htmlContent: `<p>Dear ${user.FirstName},</p><p>You have been assigned a new task by ${assignor}.</p>`,
//   });

//   if (req.io) {
//     req.io.to(user.id.toString()).emit("task-assigned", {
//       message: `A new task "${task}" has been assigned to you`,
//       task: result,
//     });
//   }

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Task successfully created!!",
//     data: result,
//   });
// });

const insertIntoDB = catchAsync(async (req, res) => {
  const {
    assignor,
    task,
    description,
    comment,
    id, // assigned user id
    student_id,
    user_id, // sender id
    branch,
    dueDate,
    priority,
  } = req.body;

  /* ----------------------------------------
     Validate Assigned User
  ---------------------------------------- */
  const user = await User.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(400, "Assigned user not found");
  }

  /* ----------------------------------------
     Validate Sender
  ---------------------------------------- */
  const sender = await User.findOne({ where: { id: user_id } });
  if (!sender) {
    throw new ApiError(400, "Sender not found");
  }

  /* ----------------------------------------
     Clean student_id properly
  ---------------------------------------- */
  let cleanedStudentId = null;

  if (student_id && student_id !== "undefined" && student_id !== "null") {
    const student = await User.findOne({
      where: { id: student_id },
    });

    if (!student) {
      throw new ApiError(400, "Student not found");
    }

    cleanedStudentId = student_id;
  }

  /* ----------------------------------------
     Handle uploaded files
  ---------------------------------------- */
  const uploadedFiles =
    req.files?.map((file) => ({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
    })) || [];

  /* ----------------------------------------
     Prepare data for insert
  ---------------------------------------- */
  const data = {
    assignor,
    task,
    student_id: cleanedStudentId,
    priority,
    dueDate,
    description: description || null,
    comment: comment && comment !== "undefined" ? comment : null,
    assignedTo: `${user.FirstName} ${user.LastName}`,
    assignedTo_id: user.id,
    user_id,
    branch,
    files: uploadedFiles,
  };

  /* ----------------------------------------
     Insert Task
  ---------------------------------------- */
  const result = await TaskService.insertIntoDB(data);

  /* ----------------------------------------
     Create Notification
  ---------------------------------------- */
  await Notification.create({
    message: `Task for you from ${assignor}`,
    branch,
    url: "task",
    userId: user.id,
  });

  /* ----------------------------------------
     Send Email
  ---------------------------------------- */
  await NotificationEmail({
    from: sender.Email,
    to: user.Email,
    subject: `New Task Assigned: ${task}`,
    htmlContent: `
      <p>Dear ${user.FirstName},</p>
      <p>You have been assigned a new task by ${assignor}.</p>
      <p><strong>Task:</strong> ${task}</p>
      <p><strong>Due Date:</strong> ${dueDate}</p>
    `,
  });

  /* ----------------------------------------
     Real-time Socket Emit
  ---------------------------------------- */
  if (req.io) {
    req.io.to(user.id.toString()).emit("task-assigned", {
      message: `A new task "${task}" has been assigned to you`,
      task: result,
    });
  }

  /* ----------------------------------------
     Final Response
  ---------------------------------------- */
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task successfully created!!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, TaskFilterAbleFileds);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await TaskService.getAllFromDB(
    { ...filters, searchTerm: req.query.searchTerm },
    options,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task data fetched!!",
    meta: result.meta,
    data: result.data,
  });
});

const getAllDataById = catchAsync(async (req, res) => {
  const { user_id } = req.params;

  const result = await TaskService.getAllDataById(user_id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task data fetch!!",
    data: result,
  });
});

const getOverview = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["branch", "user_id", "assignedTo_id"]);
  const result = await TaskService.getOverviewCountsFromDB(filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Overview fetched!!",
    data: result,
  });
});

// const updateOneFromDB = catchAsync(async (req, res) => {
//   const { id } = req.params;

//   const data = {
//     assignor: req.body.assignor === "" ? undefined : req.body.assignor,
//     assignedTo: req.body.assignedTo === "" ? undefined : req.body.assignedTo,
//     task: req.body.task === "" ? undefined : req.body.task,
//     assignedTo_id:
//       req.body.assignedTo_id === "" ? undefined : req.body.assignedTo_id,
//     description: req.body.description === "" ? undefined : req.body.description,
//     status: req.body.status === "" ? undefined : req.body.status,
//     comment: req.body.comment === "" ? undefined : req.body.comment,
//     branch: req.body.branch === "" ? undefined : req.body.branch,
//     dueDate: req.body.dueDate === "" ? undefined : req.body.dueDate,
//     user_id: req.body.user_id === "" ? undefined : req.body.user_id,
//     file: req.file ? req.file.path : undefined,
//   };

//   // const result = await TaskService.updateOneFromDB(id, data);
//   const result = await TaskService.updateOneFromDB(id, data);

//   await Notification.create({
//     message: `Update your task`,
//     branch: result?.branch,
//     url: "task",
//     userId: result?.user_id,
//   });

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Task update successfully!!",
//     data: result,
//   });
// });

const updateOneFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const uploadedFiles = req.files?.map((file) => ({
    filename: file.filename,
    path: file.path,
    mimetype: file.mimetype,
    size: file.size,
  }));

  const data = {
    assignor: req.body.assignor || undefined,
    assignedTo: req.body.assignedTo || undefined,
    student_id: req.body.student_id || undefined,
    task: req.body.task || undefined,
    assignedTo_id: req.body.assignedTo_id || undefined,
    description: req.body.description || undefined,
    priority: req.body.priority || undefined,
    status: req.body.status || undefined,
    comment: req.body.comment || undefined,
    branch: req.body.branch || undefined,
    dueDate: req.body.dueDate || undefined,
    user_id: req.body.user_id || undefined,

    files: uploadedFiles?.length ? uploadedFiles : undefined, // ✅
  };

  const result = await TaskService.updateOneFromDB(id, data);

  await Notification.create({
    message: `Update your task`,
    branch: result?.branch,
    url: "task",
    userId: result?.user_id,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task update successfully!!",
    data: result,
  });
});

const deleteIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await TaskService.deleteIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task delete successfully!!",
    data: result,
  });
});

module.exports = {
  getAllFromDB,
  getAllDataById,
  getOverview,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
};
