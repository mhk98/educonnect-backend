const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const pick = require("../../../shared/pick");
const EnquiriesService = require("./enquiries.service");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const { EnquiriesFilterAbleFileds } = require("./enquiries.constants");
const User = db.user;

const insertIntoDB = catchAsync(async (req, res) => {
  const {
    firstName,
    lastName,
    Branch,
    studyArea,
    studyLevel,
    destination,
    educationCountry,
    educationLevel,
    additionalInfo,
    Status,
    user_id,
  } = req.body;

  // Handle multiple uploaded files
  const uploadedFiles = req.files || [];

  // You can store just file paths or full metadata
  const files = uploadedFiles.map((file) => ({
    originalName: file.originalname,
    filename: file.filename,
    path: file.path,
    mimetype: file.mimetype,
  }));

  const user = await User.findOne({
    where: {
      id: user_id,
    },
  });
  if (!user) throw new ApiError(404, "User not found");

  const data = {
    firstName,
    lastName,
    studyArea,
    studyLevel,
    createdBy: `${user.FirstName} ${user.LastName}`,
    destination,
    educationCountry,
    educationLevel,
    additionalInfo,
    Branch,
    user_id,
    Status,
    files, // Add array of file info
  };

  console.log("enquiries", data);

  const result = await EnquiriesService.insertIntoDB(data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Enquiries successfully created!!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, EnquiriesFilterAbleFileds);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  console.log("filters", filters);
  const result = await EnquiriesService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task data fetched!!",
    meta: result.meta,
    data: result.data,
  });
});

const getAllDataById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await EnquiriesService.getAllDataById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Enquiries data fetch!!",
    data: result,
  });
});

const updateOneFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  console.log("enquiriesId", id);
  const {
    firstName,
    lastName,
    Branch,
    studyArea,
    studyLevel,
    destination,
    educationCountry,
    educationLevel,
    createdBy,
    Status,
    assignedTo,
    additionalInfo,
    user_id,
  } = req.body;

  console.log("data", req.body);

  // Handle multiple uploaded files
  const uploadedFiles = req.files || [];

  // You can store just file paths or full metadata
  const files = uploadedFiles.map((file) => ({
    originalName: file.originalname,
    filename: file.filename,
    path: file.path,
    mimetype: file.mimetype,
  }));
  const data = {
    firstName: firstName === "" ? undefined : firstName,
    lastName: lastName === "" ? undefined : lastName,
    studyArea: studyArea?.length === 0 ? undefined : studyArea,
    studyLevel: studyLevel?.length === 0 ? undefined : studyLevel,
    assignedTo: assignedTo === "" ? undefined : assignedTo,
    additionalInfo: additionalInfo === "" ? undefined : additionalInfo,
    Status: Status === "" ? undefined : Status,
    user_id: user_id === "" ? undefined : user_id,
    createdBy: createdBy === "" ? undefined : createdBy,
    destination: destination === "" ? undefined : destination,
    educationCountry: educationCountry === "" ? undefined : educationCountry,
    educationLevel: educationLevel === "" ? undefined : educationLevel,
    Branch: Branch === "" ? undefined : Branch,
    files: files?.length === 0 ? undefined : files,
  };

  const result = await EnquiriesService.updateOneFromDB(id, data);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Enquiries update successfully!!",
    data: result,
  });
});

const deleteIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("deleteId", id);

  const result = await EnquiriesService.deleteIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Enquiries delete successfully!!",
    data: result,
  });
});

const EnquiriesController = {
  getAllFromDB,
  getAllDataById,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
};

module.exports = EnquiriesController;
