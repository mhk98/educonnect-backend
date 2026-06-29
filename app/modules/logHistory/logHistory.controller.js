const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const db = require("../../../models");
const LogHistoryService = require("./logHistory.service");

const getAllFromDB = catchAsync(async (req, res) => {
  const user = await db.user.findByPk(req.user?.id, {
    attributes: ["id", "Role", "Branch"],
  });

  if (!["admin", "superAdmin"].includes(user?.Role)) {
    return res.status(403).json({
      status: "fail",
      error: "Forbidden",
    });
  }

  const branch = user.Role === "admin" ? user.Branch : req.query.branch;
  const result = await LogHistoryService.getAllFromDB({ branch });
  const branches = await LogHistoryService.getBranchOptions({
    branch: user.Role === "admin" ? user.Branch : undefined,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
    meta: { branches },
  });
});

module.exports = {
  getAllFromDB,
};
