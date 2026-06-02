const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const pick = require("../../../shared/pick");
const LeadReplyService = require("./leadReply.service");
const { where } = require("sequelize");

const insertIntoDB = catchAsync(async (req, res) => {
  const { user_id, location, lead_id, comment_id, text } = req.body;

  const data = {
    user_id,
    location,
    lead_id,
    comment_id,
    text,
    file: req.file ? req.file.path : undefined,
  };

  const result = await LeadReplyService.insertIntoDB(data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "LeadReply successfully created!!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const result = await LeadReplyService.getAllFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "LeadReply data fetch!!",
    data: result,
  });
});

const getDataById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await LeadReplyService.getDataById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "LeadReply data fetch!!",
    data: result,
  });
});

const updateOneFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LeadReplyService.updateOneFromDB(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "LeadReply update successfully!!",
    data: result,
  });
});

const deleteIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("deleteId", id);

  const result = await LeadReplyService.deleteIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "LeadReply delete successfully!!",
    data: result,
  });
});

const LeadController = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = LeadController;
