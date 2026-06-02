const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const pick = require("../../../shared/pick");
const ContactService = require("./contact.service");
const { ContactFilterAbleFileds } = require("./contact.constants");
const sendEmail = require("../../middlewares/emailSender");

const insertIntoDB = catchAsync(async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  const data = {
    firstName,
    lastName,
    email,
    phone,
    message,
    file: req.file ? req.file.path : undefined,
  };

  // Email HTML content
  const emailHTML = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; border-radius: 10px;">
      <h2 style="color: #333;">New Contact Form Submission</h2>
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong><br/>${message}</p>
      ${
        data.file
          ? `<p><strong>Attachment:</strong> <a href="${
              req.protocol
            }://${req.get("host")}/${
              data.file
            }" target="_blank">Download</a></p>`
          : ""
      }
    </div>
  `;

  // Send email
  const success = await sendEmail({
    from: email,
    to: "ceo@eaconsultancy.info",
    subject: "New Contact Form Submission",
    htmlContent: emailHTML,
    filePath: data.file,
  });

  if (success) {
    const result = await ContactService.insertIntoDB(data);
    console.log("result", result);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "✅ Email sent and contact saved successfully!",
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "❌ Email sending failed. Contact not saved.",
    });
  }
});

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, ContactFilterAbleFileds);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  console.log("filters", filters);
  const result = await ContactService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Contact data fetched!!",
    meta: result.meta,
    data: result.data,
  });
});

const getAllDataById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ContactService.getAllDataById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Contact data fetch!!",
    data: result,
  });
});

const updateOneFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { amount, Branch, user_id, status, purpose } = req.body;

  const data = {
    amount: amount === "" ? undefined : amount,
    user_id: user_id === "" ? undefined : user_id,
    Branch: Branch === "" ? undefined : Branch,
    status: status === "" ? undefined : status,
    purpose: purpose === "" ? undefined : purpose,
    file: req.file ? req.file.path : undefined,
  };

  console.log("Contact", req.body);
  console.log("ContactId", id);
  const result = await ContactService.updateOneFromDB(id, data);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Contact update successfully!!",
    data: result,
  });
});

const deleteIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("deleteId", id);

  const result = await ContactService.deleteIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Contact delete successfully!!",
    data: result,
  });
});

const ContactController = {
  getAllFromDB,
  getAllDataById,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
};

module.exports = ContactController;
