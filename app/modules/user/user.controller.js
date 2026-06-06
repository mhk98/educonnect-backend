const catchAsync = require("../../../shared/catchAsync");
const pick = require("../../../shared/pick");
const sendResponse = require("../../../shared/sendResponse");
const NotificationService = require("../notification/notification.service");
const { UserFilterAbleFileds } = require("./user.constants");
const UserService = require("./user.service");
// const { UserService } = require("./user.service");
const bcrypt = require("bcryptjs");
const sendEmail = require("../../middlewares/emailSender");

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

  // Send login credentials email to the newly created user
  if (Email) {
    const appUrl = process.env.APP_URL || "https://app.eaconsultancy.org";
    const roleLabel =
      cleanRole === "employee" ? "Employee" :
      cleanRole === "admin"    ? "Admin"    : "Student";

    sendEmail({
      to: Email,
      subject: `Welcome to EduConnect — Your ${roleLabel} Account`,
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:540px;margin:0 auto;background:#f9fafb;border-radius:14px;overflow:hidden;">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#1B2E6B 0%,#2563EB 100%);padding:32px 28px;text-align:center;">
            <h1 style="color:#fff;font-size:22px;margin:0;letter-spacing:0.3px;">Welcome to EduConnect!</h1>
            <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:8px 0 0;">Your account has been created successfully</p>
          </div>
          <!-- Body -->
          <div style="padding:32px 28px;">
            <p style="color:#374151;font-size:15px;margin:0 0 8px;">Hi <strong>${FirstName} ${LastName}</strong>,</p>
            <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 24px;">
              Your <strong>${roleLabel}</strong> account on the EduConnect portal is ready.
              Use the credentials below to log in.
            </p>

            <!-- Credentials box -->
            <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:22px 24px;margin-bottom:24px;">
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr>
                  <td style="color:#9ca3af;padding:8px 0;width:38%;vertical-align:top;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Login Link</td>
                  <td style="padding:8px 0;">
                    <a href="${appUrl}" style="color:#2563EB;font-weight:600;text-decoration:none;">${appUrl}</a>
                  </td>
                </tr>
                <tr style="border-top:1px solid #f3f4f6;">
                  <td style="color:#9ca3af;padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Email</td>
                  <td style="color:#111827;font-weight:600;padding:8px 0;">${Email}</td>
                </tr>
                <tr style="border-top:1px solid #f3f4f6;">
                  <td style="color:#9ca3af;padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Password</td>
                  <td style="padding:8px 0;">
                    <span style="background:#EFF6FF;color:#1B2E6B;font-weight:700;font-size:18px;letter-spacing:4px;padding:4px 12px;border-radius:6px;font-family:monospace;">${Password}</span>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Warning -->
            <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 16px;margin-bottom:24px;">
              <p style="color:#dc2626;font-size:13px;margin:0;">
                ⚠️ For security, please change your password immediately after first login.
              </p>
            </div>

            <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;padding-top:16px;border-top:1px solid #f3f4f6;">
              EduConnect &mdash; EA Consultancy &nbsp;|&nbsp; Study Abroad
            </p>
          </div>
        </div>
      `,
    }).catch((err) => console.error("Credentials email failed:", err));
  }

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

const impersonateUser = catchAsync(async (req, res) => {
  const requesterId = req.user?.id;
  const { id: targetId } = req.params;

  const result = await UserService.impersonateUser(requesterId, targetId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Impersonation successful!",
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
  impersonateUser,
};

module.exports = UserController;
