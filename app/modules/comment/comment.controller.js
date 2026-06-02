const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const CommentService = require("./comment.service");

// Insert new comment into the database
const insertIntoDB = catchAsync(async (req, res) => {
  const result = await CommentService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment successfully created!!",
    data: result,
  });
});

// Get comments by application ID
const getDataById = catchAsync(async (req, res) => {
  const { enquiry_id } = req.params;

  const result = await CommentService.getDataById(enquiry_id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment data fetched successfully!!",
    data: result,
  });
});

// Export the controller functions
const CommentController = {
  insertIntoDB,
  getDataById,
};

module.exports = CommentController;
