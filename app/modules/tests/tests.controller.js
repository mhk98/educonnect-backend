const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const TestsService = require("./tests.service");
const db = require("../../../models");
const User = db.user;
const NotificationService = require("../notification/notification.service");
const { Op } = require("sequelize");
const Notification = db.notification;

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await TestsService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tests successfully created!!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const result = await TestsService.getAllFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tests data fetch!!",
    data: result,
  });
});

const getDataById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await TestsService.getDataById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tests data fetch!!",
    data: result,
  });
});

const updateOneFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  // 1️⃣ User check
  const user = await User.findOne({ where: { id } });
  if (!user) {
    throw new Error("User not found.");
  }

  const result = await TestsService.updateOneFromDB(id, req.body);

  // 3️⃣ Create notification if update was successful
  if (result && result[0] > 0) {
    const users = await User.findAll({
      where: {
        Branch: user.Branch,
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
          message: `${user.Branch} branch student ${user.FirstName} ${user.LastName} updated test information`,
          branch: user.Branch,
          url: `editprofile/${user.id}`,
        })
      )
    );
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tests update successfully!!",
    data: result,
  });
});

const deleteIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("deleteId", id);

  const result = await TestsService.deleteIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tests delete successfully!!",
    data: result,
  });
});

const TestsController = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = TestsController;
