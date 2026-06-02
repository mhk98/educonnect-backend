const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const pick = require("../../../shared/pick");
const BranchService = require("./branch.service");
const { BranchFilterAbleFileds } = require("./branch.constants");
const sendEmail = require("../../middlewares/emailSender");

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await BranchService.insertIntoDB(req.body);
  console.log("result", result);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "✅ Branch saved successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, BranchFilterAbleFileds);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  console.log("filters", filters);
  const result = await BranchService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Branch data fetched!!",
    // meta: result.meta,
    // data: result.data,
    data: result,
  });
});

const getAllDataById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await BranchService.getAllDataById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Branch data fetch!!",
    data: result,
  });
});

const updateOneFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const data = req.body;

  const result = await BranchService.updateOneFromDB(id, data);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Branch update successfully!!",
    data: result,
  });
});

const deleteIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("deleteId", id);

  const result = await BranchService.deleteIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Branch delete successfully!!",
    data: result,
  });
});

const BranchController = {
  getAllFromDB,
  getAllDataById,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
};

module.exports = BranchController;
