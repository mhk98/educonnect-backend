const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const QuickLinkService = require("./quickLink.service");

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await QuickLinkService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Quick link created successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const result = await QuickLinkService.getAllFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Quick links fetched!",
    data: result,
  });
});

const updateOneFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await QuickLinkService.updateOneFromDB(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Quick link updated successfully!",
    data: result,
  });
});

const deleteIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await QuickLinkService.deleteIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Quick link deleted successfully!",
    data: result,
  });
});

const QuickLinkController = {
  insertIntoDB,
  getAllFromDB,
  updateOneFromDB,
  deleteIdFromDB,
};

module.exports = QuickLinkController;
