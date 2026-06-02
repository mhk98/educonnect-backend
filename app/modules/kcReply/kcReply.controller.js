const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const pick = require("../../../shared/pick");
const KCReplyService = require("./kcReply.service");

const insertIntoDB = catchAsync(async (req, res) => {
  const { user_id, kcComment_id, text, userId, application_id} = req.body;

  const data = {
    user_id,
    userId,
    application_id,
    kcComment_id,
    text,
    file: req.file ? req.file.path : undefined,
  };

  const result = await KCReplyService.insertIntoDB(data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "KCReply successfully created!!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const result = await KCReplyService.getAllFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "KCReply data fetch!!",
    data: result,
  });
});

const getDataById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await KCReplyService.getDataById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "KCReply data fetch!!",
    data: result,
  });
});

const updateOneFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await KCReplyService.updateOneFromDB(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "KCReply update successfully!!",
    data: result,
  });
});

const deleteIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("deleteId", id);

  const result = await KCReplyService.deleteIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "KCReply delete successfully!!",
    data: result,
  });
});

const kcController = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = kcController;
