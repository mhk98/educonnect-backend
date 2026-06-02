const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const LeadCommentService = require("./leadComment.service");

// Insert new comment into the database
const insertIntoDB = catchAsync(async (req, res) => {
  const { user_id, text, lead_id, location } = req.body;

  const data = {
    user_id,
    text,
    lead_id,
    location,
    file: req.file ? req.file.path : undefined,
  };

  const result = await LeadCommentService.insertIntoDB(data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "LeadComment successfully created!!",
    data: result,
  });
});

// Get comments by application ID
const getDataById = catchAsync(async (req, res) => {
  const { lead_id } = req.params;

  const result = await LeadCommentService.getDataById(lead_id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "LeadComment data fetched successfully!!",
    data: result,
  });
});

// Export the controller functions
const LeadCommentController = {
  insertIntoDB,
  getDataById,
};

module.exports = LeadCommentController;
