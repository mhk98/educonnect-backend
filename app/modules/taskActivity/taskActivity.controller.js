const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const TaskActivityService = require("./taskActivity.service");

const getTaskActivity = catchAsync(async (req, res) => {
  const result = await TaskActivityService.getActivityByTask(req.params.taskId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
  });
});

module.exports = {
  getTaskActivity,
};
