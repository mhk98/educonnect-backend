const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const NotificationService = require("../notification/notification.service");
const PendingPaymentService = require("./pendingPayment.service");
const db = require("../../../models");
const { Op } = require("sequelize");
const ApiError = require("../../../error/ApiError");
const pick = require("../../../shared/pick");
const {
  PendingPaymentFilterAbleFileds,
} = require("./pendingPayment.constants");
const User = db.user;
const Notification = db.notification;

const initPayment = catchAsync(async (req, res) => {
  const { amount, paymentStatus, employee, purpose, user_id, branch, userId } =
    req.body;

  const data = {
    amount,
    paymentStatus,
    user_id,
    employee,
    branch,
    purpose,
    file: req.file ? req.file.path : undefined,
  };

  // 1️⃣ User check
  const student = await User.findOne({ where: { id: user_id } });
  if (!student) {
    throw new Error("student not found.");
  }

  console.log("paymentData", req.body);
  const result = await PendingPaymentService.initPayment(data);

  console.log("result", result);

  // if (!result) {
  //   throw new ApiError(400, "Failed to create");
  // }
  if (!result?.payment) {
    throw new ApiError(400, "Payment creation failed");
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
        message: `${student.FirstName} ${student.LastName} paid ${amount} for ${purpose}`,
        branch: user.Branch,
        url: `editprofile/${user.id}`,
      }),
    ),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment initialized successfully",
    data: result,
  });
});

const webhook = catchAsync(async (req, res) => {
  const result = await PendingPaymentService.webhook(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment validated successfully",
    data: result,
  });
});

const getAllDataById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await PendingPaymentService.getAllDataById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Pending payment data fetch!!",
    data: result,
  });
});

const getAllData = catchAsync(async (req, res) => {
  const filters = pick(req.query, PendingPaymentFilterAbleFileds);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await PendingPaymentService.getAllData(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Pending payment data fetch!!",
    data: result,
  });
});

const getAllFromDBWithoutQuery = catchAsync(async (req, res) => {
  const result = await PendingPaymentService.getAllFromDBWithoutQuery();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Pending payment data fetch!!",
    data: result,
  });
});

const updateOneFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const {
    amount,
    transactionId,
    user_id,
    status,
    paymentStatus,
    employee,
    purpose,
    paymentGatewayData,
    branch,
  } = req.body;

  const data = {
    amount: amount === "" ? undefined : amount,
    user_id: user_id === "" ? undefined : user_id,
    transactionId: transactionId === "" ? undefined : transactionId,
    employee: employee === "" ? undefined : employee,
    paymentStatus: paymentStatus === "" ? undefined : paymentStatus,
    status: status === "" ? undefined : status,
    branch: branch === "" ? undefined : branch,
    purpose: purpose === "" ? undefined : purpose,
    paymentGatewayData:
      paymentGatewayData === "" ? undefined : paymentGatewayData,
    file: req.file ? req.file.path : undefined,
  };

  console.log("Pending payment", req.body);
  console.log("Pending paymentId", id);
  const result = await PendingPaymentService.updateOneFromDB(id, data);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Pending payment update successfully!!",
    data: result,
  });
});

const deleteIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("deleteId", id);

  const result = await PendingPaymentService.deleteIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Pending payment delete successfully!!",
    data: result,
  });
});

module.exports = {
  initPayment,
  webhook,
  getAllDataById,
  getAllData,
  updateOneFromDB,
  deleteIdFromDB,
  getAllFromDBWithoutQuery,
};
