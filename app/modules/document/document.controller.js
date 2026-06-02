const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const DocumentService = require("./document.service");
const db = require("../../../models");
const NotificationService = require("../notification/notification.service");
const { Op } = require("sequelize");
const ApiError = require("../../../error/ApiError");
const User = db.user;
const Notification = db.notification;

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await DocumentService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Documents successfully created!!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const result = await DocumentService.getAllFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Documents data fetch!!",
    data: result,
  });
});

const getDataById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await DocumentService.getDataById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Documents data fetch!!",
    data: result,
  });
});

const updateOneFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { userId } = req.body;
  // 1️⃣ User check
  const student = await User.findOne({ where: { id } });
  if (!student) {
    throw new Error("User not found.");
  }

  console.log("document", req.files);

  const result = await DocumentService.updateOneFromDB(id, req.files);

  if (!result) {
    throw new ApiError(400, "Failed to udpate document");
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
        message: `${user.FirstName} ${user.LastName} update mandatory documents`,
        branch: user.Branch,
        url: `editprofile/${user.id}`,
      })
    )
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Documents update successfully!!",
    data: result,
  });
});

const deleteIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("deleteId", id);

  const result = await DocumentService.deleteIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Documents delete successfully!!",
    data: result,
  });
});

const DocumentController = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = DocumentController;
