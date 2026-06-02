const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const pick = require("../../../shared/pick");
const ProfileService = require("./profile.service");
const db = require("../../../models");
const NotificationService = require("../notification/notification.service");
const { Op } = require("sequelize");
const ApiError = require("../../../error/ApiError");
const User = db.user;
const Notification = db.notification;

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await ProfileService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successfully created Profile!!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const result = await ProfileService.getAllFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile data fetch!!",
    data: result,
  });
});

const getDataById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProfileService.getDataById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile data fetch!!",
    data: result,
  });
});

const updateOneFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { userId } = req.body;
  // 1️⃣ User check
  const student = await User.findOne({ where: { id: id } });
  if (!student) {
    throw new Error("User not found.");
  }

  // 2️⃣ Update user profile
  const result = await ProfileService.updateOneFromDB(id, req.body);

  if (!result) {
    throw new ApiError(400, "Failed to update profile");
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
        message: `Updated personal information of ${user.FirstName} ${user.LastName}`,
        branch: user.Branch,
        url: `editprofile/${user.id}`,
      })
    )
  );

  // 3️⃣ Response
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated successfully!",
    data: result, // You might want to send the updated user data here instead
  });
});

const deleteIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("deleteId", id);

  const result = await ProfileService.deleteIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile delete successfully!!",
    data: result,
  });
});

const ProfileController = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = ProfileController;
