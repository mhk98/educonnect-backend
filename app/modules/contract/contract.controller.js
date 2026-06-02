const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const pick = require("../../../shared/pick");
const ContractService = require("./contract.service");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const User = db.user;
const Notification = db.notification;

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await ContractService.insertIntoDB(req.body);
  console.log("result", result);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application successfully created!!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const result = await ContractService.getAllFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application data fetch!!",
    data: result,
  });
});

const getDataById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ContractService.getDataById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application data fetch!!",
    data: result,
  });
});

const updateOneFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  // 1️⃣ User check
  const student = await User.findOne({ where: { id } });
  if (!student) {
    throw new Error("User not found.");
  }

  const result = await ContractService.updateOneFromDB(id, req.body);

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

  const result = await ContractService.deleteIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application delete successfully!!",
    data: result,
  });
});

const ContractController = {
  getDataById,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getAllFromDB,
};

module.exports = ContractController;
