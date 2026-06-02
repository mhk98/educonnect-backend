const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const pick = require("../../../shared/pick");
const ApplicationService = require("./academic.service");
const { where, Op } = require("sequelize");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const User = db.user;
const Notification = db.notification;

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await ApplicationService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application successfully created!!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const result = await ApplicationService.getAllFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application data fetch!!",
    data: result,
  });
});

const getDataById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ApplicationService.getDataById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application data fetch!!",
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

  const result = await ApplicationService.updateOneFromDB(id, req.body);

  if (!result) {
    throw new ApiError(400, "Failed to udpate academic information");
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
        message: `${student.FirstName} ${student.LastName} updated academic information`,
        branch: user.Branch,
        url: `editprofile/${user.id}`,
      })
    )
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application update successfully!!",
    data: result,
  });
});

const deleteIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("deleteId", id);

  const result = await ApplicationService.deleteIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application delete successfully!!",
    data: result,
  });
});

const AcademicController = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = AcademicController;
