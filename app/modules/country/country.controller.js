const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const pick = require("../../../shared/pick");
const CountryService = require("./country.service");
const { CountryFilterAbleFileds } = require("./country.constants");

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await CountryService.insertIntoDB(req.body);
  console.log("result", result);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "✅Country saved successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, CountryFilterAbleFileds);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  console.log("filters", filters);
  const result = await CountryService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Country data fetched!!",
    // meta: result.meta,
    // data: result.data,
    data: result,
  });
});

const getAllDataById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CountryService.getAllDataById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Country data fetch!!",
    data: result,
  });
});

const updateOneFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CountryService.updateOneFromDB(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Country update successfully!!",
    data: result,
  });
});

const deleteIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("deleteId", id);

  const result = await CountryService.deleteIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Country delete successfully!!",
    data: result,
  });
});

const CountryController = {
  getAllFromDB,
  getAllDataById,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
};

module.exports = CountryController;
