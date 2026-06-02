const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const pick = require("../../../shared/pick");
const RequestPaymentService = require("./requestPayment.service");
const db = require("../../../models");
const NotificationService = require("../notification/notification.service");
const { Op } = require("sequelize");
const ApiError = require("../../../error/ApiError");
const User = db.user;
const Notification = db.notification;

const insertIntoDB = catchAsync(async (req, res) => {
  const { user_id, amount, paymentReason, userId } = req.body;
  // 1️⃣ User check
  const student = await User.findOne({ where: { id: user_id } });
  if (!student) {
    throw new Error("User not found.");
  }
  const result = await RequestPaymentService.insertIntoDB(req.body);

  if (!result) {
    throw new ApiError(400, "Failed to create request");
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
        message: `${student.FirstName} ${student.LastName} please pay ${amount} Taka for ${paymentReason}`,
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
  const result = await RequestPaymentService.getAllFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application data fetch!!",
    data: result,
  });
});

const getAllDataById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await RequestPaymentService.getAllDataById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application data fetch!!",
    data: result,
  });
});

const updateOneFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { user_id, userId } = req.body;

  // 1️⃣ User check
  const student = await User.findOne({ where: { id: user_id } });
  if (!student) {
    throw new Error("User not found.");
  }

  const result = await RequestPaymentService.updateOneFromDB(id, req.body);

  if (!result) {
    throw new ApiError(400, "Failed to update request");
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
        message: `${user.FirstName} ${user.LastName} please pay your payment`,
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

  const result = await RequestPaymentService.deleteIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application delete successfully!!",
    data: result,
  });
});

const RequestPaymentController = {
  getAllFromDB,
  getAllDataById,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
};

module.exports = RequestPaymentController;
