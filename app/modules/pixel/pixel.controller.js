const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const PixelService = require("./pixel.service");

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await PixelService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Pixel event successfully created!!",
    data: result,
  });
});

const PixelController = {
  insertIntoDB,
};

module.exports = PixelController;
