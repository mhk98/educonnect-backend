const catchAsync = require("../../../shared/catchAsync");
const pick = require("../../../shared/pick");
const sendResponse = require("../../../shared/sendResponse");
const NotificationService = require("../notification/notification.service");
const { UserFilterAbleFileds } = require("./user.constants");
const UserService = require("./user.service");
// const { UserService } = require("./user.service");
const bcrypt = require("bcryptjs");

const login = catchAsync(async (req, res) => {
  console.log(req.body);

  const result = await UserService.login(req.body);

  // Configure cookie options for token storage (optional: for API responses)
  const cookieOptions = {
    secure: process.env.NODE_ENV === "production", // Secure cookies in production
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    sameSite: "strict", // Optional: Add for additional security
  };

  // If you are using `res` for cookies in an Express/Next.js API, uncomment this:
  res.cookie("accessToken", result.accessToken, cookieOptions);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User login successfully!!",
    data: result,
  });
});

const register = catchAsync(async (req, res) => {
  const {
    FirstName,
    LastName,
    Email,
    Password,
    Phone,
    Branch,
    Role,
    CreatedOn,
    Address,
    userId,
  } = req.body;

  const cleanRole =
    Role && Role !== "undefined" && Role.trim() !== "" ? Role : "student";

  const data = {
    FirstName,
    LastName,
    Email,
    Password,
    Phone,
    Role: cleanRole,
    Branch,
    Address,
    CreatedOn,
    image: req.file ? req.file.path : undefined,
  };

  if (Role === "student") {
    const notificationData = {
      message: `New student for ${Branch} Branch`,
      branch: Branch,
      url: "students",
      userId: userId,
    };

    // -------- 3️⃣ Create Notification --------
    await NotificationService.createNotification(notificationData);
  }

  const result = await UserService.register(data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User registered successfully!!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, UserFilterAbleFileds);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  console.log("filters", filters);
  const result = await UserService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task data fetched!!",
    meta: result.meta,
    data: result.data,
  });
});

const getAllActiveStudentFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, UserFilterAbleFileds);
  // const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  console.log("filters", filters);
  const result = await UserService.getAllActiveStudentFromDB(filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task data fetched!!",
    meta: result.meta,
    data: result.data,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const result = await UserService.getUserById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User data fetched!!",
    data: result,
  });
});

const getOverview = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["Role", "Branch"]);
  const result = await UserService.getOverviewCountsFromDB(filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Overview fetched!!",
    data: result,
  });
});

const updateUserFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("userId", id);
  const {
    FirstName,
    LastName,
    Email,
    newPassword,
    Phone,
    Role,
    Profile,
    CreatedOn,
    Status,
    Branch,
    Address,
    RegionalStatus,
  } = req.body;

  console.log("file", req.file);

  // Hash and update the new password
  // const salt = await bcrypt.genSalt(10);

  // const Password = await bcrypt.hash(newPassword, salt);

  let Password;

  // ✅ শুধু তখনই hash করবে যদি newPassword থাকে
  if (newPassword && newPassword.trim() !== "") {
    const salt = await bcrypt.genSalt(10);
    Password = await bcrypt.hash(newPassword, salt);
  }

  const data = {
    FirstName: FirstName === "" ? undefined : FirstName,
    LastName: LastName === "" ? undefined : LastName,
    Email: Email === "" ? undefined : Email,
    Password: Password === "" ? undefined : Password,
    Phone: Phone === "" ? undefined : Phone,
    Role: Role === "" ? undefined : Role,
    Role: Role === "" ? undefined : Role,
    Profile: Profile === "" ? undefined : Profile,
    Branch: Branch === "" ? undefined : Branch,
    Address: Address === "" ? undefined : Address,
    Status: Status === "" ? undefined : Status,
    RegionalStatus: RegionalStatus === "" ? undefined : RegionalStatus,
    CreatedOn: CreatedOn === "" ? undefined : CreatedOn,
    image: req.file === undefined ? undefined : req.file.path,
  };

  // console.log('userData', data);

  console.log(id);
  const result = await UserService.updateUserFromDB(id, data);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User update successfully!!",
    data: result,
  });
});

const deleteUserFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserService.deleteUserFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User delete successfully!!",
    data: result,
  });
});

const updateUserPasswordFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.updateUserPasswordFromDB(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password change successfully!!",
    data: result,
  });
});

const UserController = {
  getAllFromDB,
  login,
  register,
  getUserById,
  updateUserFromDB,
  deleteUserFromDB,
  updateUserPasswordFromDB,
  getAllActiveStudentFromDB,
  getOverview,
};

module.exports = UserController;
