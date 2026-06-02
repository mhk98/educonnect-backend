const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const pick = require("../../../shared/pick");
const ApplicationService = require("./application.service");
const { ApplicationFilterAbleFileds } = require("./application.constants");
const { Op } = require("sequelize");
const db = require("../../../models");
const NotificationService = require("../notification/notification.service");
const ApiError = require("../../../error/ApiError");
const User = db.user;
const Notification = db.notification;

const insertIntoDB = catchAsync(async (req, res) => {
  const { user_id, userId } = req.body;
  // 1️⃣ User check
  const student = await User.findOne({ where: { id: user_id } });
  if (!student) {
    throw new Error("Student not found.");
  }

  const result = await ApplicationService.insertIntoDB(req.body);

  if (!result) {
    throw new ApiError(400, "Failed to create application");
  }

  // 3️⃣ Create notification if update was successful
  const users = await User.findAll({
    where: {
      [Op.or]: [
        { Branch: "Edu Anchor" }, // 🔹 Edu Anchor branch
        { Branch: student.Branch }, // 🔹 ইনপুট branch
      ],
      id: { [Op.ne]: userId },
    },
  });

  console.log("Target users (excluding sender):", users.length);

  if (!users.length) {
    console.log("No users found in this branch (excluding sender).");
    return [];
  }

  // 2️⃣ Create notification for each remaining user
  await Promise.all(
    users.map((user) =>
      Notification.create({
        userId: user.id,
        message: `${student.FirstName} ${student.LastName} applied a new program`,
        branch: user.Branch,
        url: `editprofile/${user.id}`,
      })
    )
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application successfully created!!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, ApplicationFilterAbleFileds);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  console.log("ApplicationFilters", filters);
  const result = await ApplicationService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task data fetched!!",
    meta: result.meta,
    data: result.data,
  });
});

const getAllDataById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ApplicationService.getAllDataById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application data fetch!!",
    data: result,
  });
});

const getAllApplications = catchAsync(async (req, res) => {
  // Only pick allowed filter fields from query
  const filters = pick(req.query, ApplicationFilterAbleFileds);

  console.log("filters", filters);
  // Pagination + sorting options
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await ApplicationService.getAllApplications(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application data fetched successfully!",

    data: result,
  });
});

const updateOneFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { user_id, userId, assignee, status } = req.body;

  // 1️⃣ User check
  const student = await User.findOne({ where: { id: user_id } });
  if (!student) {
    throw new Error("Student not found.");
  }

  const result = await ApplicationService.updateOneFromDB(id, req.body);

  if (!result) {
    throw new ApiError(400, "Failed to udpate application");
  }

  // 3️⃣ Create notification if update was successful
  const users = await User.findAll({
    where: {
      [Op.or]: [
        { Branch: "Edu Anchor" }, // 🔹 Edu Anchor branch
        { Branch: student.Branch }, // 🔹 ইনপুট branch
      ],
      id: { [Op.ne]: userId },
    },
  });

  console.log("Target users (excluding sender):", users.length);

  if (!users.length) {
    console.log("No users found in this branch (excluding sender).");
    return [];
  }

  // 2️⃣ Create notification for each remaining user

  if (assignee) {
    await Promise.all(
      users.map((user) =>
        Notification.create({
          userId: user.id,
          message: `${student.FirstName} ${student.LastName} application assignee ${assignee}`,
          branch: user.Branch,
          url: `editprofile/${student.id}`,
        })
      )
    );
  } else if (status) {
    await Promise.all(
      users.map((user) =>
        Notification.create({
          userId: user.id,
          message: `${student.FirstName} ${student.LastName} application status now ${status}`,
          branch: user.Branch,
          url: `editprofile/${student.id}`,
        })
      )
    );
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application update successfully!!",
    data: result,
  });
});

const deleteIdFromDB = catchAsync(async (req, res) => {
  const { acknowledge } = req.params;
  console.log("deleteId", acknowledge);

  const result = await ApplicationService.deleteIdFromDB(acknowledge);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application delete successfully!!",
    data: result,
  });
});

const ApplicationController = {
  getAllFromDB,
  getAllDataById,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getAllApplications,
};

module.exports = ApplicationController;
