const ApiError = require("../../../error/ApiError");
const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const AdditionalDocumentService = require("./additionalDocument.service");
const db = require("../../../models");
const { Op } = require("sequelize");
const User = db.user;
const Notification = db.notification;

// const insertIntoDB = catchAsync(async (req, res) => {
//   const { title, user_id, userId } = req.body;

//   if (!req.file) {
//     throw new ApiError(400, "No file uploaded");
//   }

//   const filePath = req.file.path.replace(/\\/g, "/");

//   const info = { title, user_id };

//   // 1️⃣ User check
//   const user = await User.findOne({ where: { id: user_id } });
//   if (!user) {
//     throw new Error("User not found.");
//   }

//   const result = await AdditionalDocumentService.insertIntoDB(info, filePath);

//   // 3️⃣ Create notification if update was successful
//   if (result && result[0] > 0) {
//     const users = await User.findAll({
//       where: {
//         Branch: user.Branch,
//         id: { [Op.ne]: userId },
//       },
//     });

//     console.log("Target users (excluding sender):", users.length);

//     if (!users.length) {
//       console.log("No users found in this branch (excluding sender).");
//       return [];
//     }

//     // 2️⃣ Create notification for each remaining user
//     await Promise.all(
//       users.map((user) =>
//         Notification.create({
//           userId: user.id,
//           message: `Updated ${user.FirstName} ${user.LastName} additional document`,
//           branch: user.Branch,
//           url: `editprofile/${user.id}`,
//         })
//       )
//     );
//   }

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Document successfully uploaded!",
//     data: result,
//   });
// });

const insertIntoDB = catchAsync(async (req, res) => {
  const { title, user_id, userId } = req.body; // user_id = uploader, userId = sender (logged-in user)

  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const filePath = req.file.path.replace(/\\/g, "/");

  const info = { title, user_id };

  // 1️⃣ Find the uploader user (student)
  const uploader = await User.findOne({ where: { id: user_id } });
  if (!uploader) {
    throw new Error("User not found.");
  }

  const result = await AdditionalDocumentService.insertIntoDB(info, filePath);
  if (!result) {
    throw new ApiError(400, "Failed to udpate additional document");
  }

  // 2️⃣ If updated successfully → create notification
  const targetUsers = await User.findAll({
    where: {
      [Op.or]: [
        { Branch: "Edu Anchor" }, // 🔹 Edu Anchor branch
        { Branch: uploader.Branch }, // 🔹 ইনপুট branch
      ],
      id: { [Op.ne]: userId }, // exclude person who triggered upload (Admin/Staff)
    },
  });

  if (targetUsers.length > 0) {
    await Promise.all(
      targetUsers.map((receiver) =>
        Notification.create({
          userId: receiver.id, // receiver
          branch: uploader.Branch,
          url: `editprofile/${uploader.id}`, // correct profile
          message: `${uploader.FirstName} ${uploader.LastName} uploaded a new additional document`, // correct message
        })
      )
    );
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Document successfully uploaded!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const result = await AdditionalDocumentService.getAllFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Documents data fetch!!",
    data: result,
  });
});

const getDataById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdditionalDocumentService.getDataById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Documents data fetch!!",
    data: result,
  });
});

const updateOneFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { user_id, userId, assignee } = req.body;

  // 1️⃣ User check
  const student = await User.findOne({ where: { id: user_id } });
  if (!student) {
    throw new Error("User not found.");
  }

  const result = await AdditionalDocumentService.updateOneFromDB(id, req.files);

  if (!result) {
    throw new ApiError(400, "Failed to udpate document");
  }

  const users = await User.findAll({
    where: {
      [Op.or]: [
        { Branch: "Edu Anchor" }, // 🔹 Edu Anchor branch
        { Branch: student.Branch }, // 🔹 ইনপুট branch
      ],
      id: { [Op.ne]: userId },
    },
  });

  console.log("Target users (excluding sender):", users.length);

  if (!users.length) {
    console.log("No users found in this branch (excluding sender).");
    return [];
  }

  // 2️⃣ Create notification for each remaining user
  await Promise.all(
    users.map((user) =>
      Notification.create({
        userId: user.id,
        message: `Updated additional document of ${student.FirstName} ${student.LastName}`,
        branch: user.Branch,
        url: `editprofile/${user.id}`,
      })
    )
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Documents update successfully!!",
    data: result,
  });
});

const deleteIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("deleteId", id);

  const result = await AdditionalDocumentService.deleteIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Documents delete successfully!!",
    data: result,
  });
});

const AdditionalDocumentController = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = AdditionalDocumentController;
