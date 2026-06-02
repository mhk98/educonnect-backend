const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const pick = require("../../../shared/pick");
const ConsultationService = require("./consultation.service");
const { ConsultationFilterAbleFileds } = require("./consultation.constants");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const { Op, Sequelize } = require("sequelize");
const NotificationService = require("../notification/notification.service");
const User = db.user;

// const insertIntoDB = catchAsync(async (req, res) => {
//   const { userId, branch, role, url } = req.body;

//   console.log("notification data", userId, branch, role, url);
//   // Create notification(s)
//   const notification = await NotificationService.createNotification({
//     userId,
//     message: "New Consultation Created",
//     branch,
//     role,
//     url,
//   });

//   // Emit via Socket.IO
//   const io = req.app.get("io");

//   if (Array.isArray(notification)) {
//     notification.forEach((notif) => {
//       io.to(notif.userId.toString()).emit("new_notification", notif);
//     });
//   } else {
//     io.to(notification.userId.toString()).emit(
//       "new_notification",
//       notification
//     );
//   }

//   const result = await ConsultationService.insertIntoDB(req.body);
//   console.log("result", result);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Consultation successfully created!!",
//     data: result,
//   });
// });

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await ConsultationService.insertIntoDB(req.body);

  // -------- 5️⃣ Send Response --------
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Consultation successfully created with notifications!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, ConsultationFilterAbleFileds);

  console.log(filters);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await ConsultationService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Consultation data fetched!!",
    meta: result.meta,
    data: result.data,
  });
});

const getDataById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ConsultationService.getDataById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Consultation data fetch!!",
    data: result,
  });
});

const getLeadInfoById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ConsultationService.getLeadInfoById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Consultation data fetch!!",
    data: result,
  });
});

// const updateOneFromDB = catchAsync(async (req, res) => {
//     const {id} = req.params;
//     const { fullName, phone, email, date, destination, address, status,
//   ielts, ieltsScore, appointmentDate, location, applicationCode,
//   sscYear, sscDepartment, sscCGPA,
//   hscYear, hscDepartment, hscCGPA,
//   bachelorYear, bachelorDepartment, bachelorCGPA,
//   agree1, agree2, assignedTo } = req.body;

//   // let name;
//   // if (assignedTo) {
//   //   const user = await User.findOne({ where: { id: assignedTo } });
//   //   name = user ? `${user.FirstName} ${user.LastName}` : undefined;
//   // }

//   // This is only needed if frontend sends a name instead of an ID
// const user = await User.findOne({
//   where: {
//     [Op.or]: [
//       { id: assignedTo },
//       Sequelize.where(Sequelize.fn('concat', Sequelize.col('FirstName'), ' ', Sequelize.col('LastName')), assignedTo)
//     ]
//   }
// });

// if (!user || !user.id) {
//   throw new ApiError('Invalid user_id: user not found');
// }

//  const data = {
//   fullName: fullName === "" ? undefined : fullName,
//   status: status === "" ? undefined : status,
//   phone: phone === "" ? undefined : phone,
//   email: email === "" ? undefined : email,
//   date: date === "" ? undefined : date,
//   destination: destination === "" ? undefined : destination,
//   address: address === "" ? undefined : address,
//   ielts: ielts === "" ? undefined : ielts,
//   ieltsScore: ieltsScore === "" ? undefined : ieltsScore,
//   appointmentDate: appointmentDate === "" ? undefined : appointmentDate,
//   location: location === "" ? undefined : location,
//   applicationCode: applicationCode === "" ? undefined : applicationCode,

//   sscYear: sscYear === "" ? undefined : sscYear,
//   sscDepartment: sscDepartment === "" ? undefined : sscDepartment,
//   sscCGPA: sscCGPA === "" ? undefined : sscCGPA,

//   hscYear: hscYear === "" ? undefined : hscYear,
//   hscDepartment: hscDepartment === "" ? undefined : hscDepartment,
//   hscCGPA: hscCGPA === "" ? undefined : hscCGPA,

//   bachelorYear: bachelorYear === "" ? undefined : bachelorYear,
//   bachelorDepartment: bachelorDepartment === "" ? undefined : bachelorDepartment,
//   bachelorCGPA: bachelorCGPA === "" ? undefined : bachelorCGPA,

//   agree1: agree1 === "" ? undefined : agree1,
//   agree2: agree2 === "" ? undefined : agree2,
//   user_id: assignedTo === "" ? undefined : assignedTo,
//   assignedTo: name=== "" ? undefined : name,
// };

//   console.log("Consultation", req.body)
//   console.log("ConsultationId", id)
//       const result = await ConsultationService.updateOneFromDB(id, data);
//       sendResponse(res, {
//           statusCode: 200,
//           success: true,
//           message: "Consultation update successfully!!",
//           data: result
//       })
//     })

const updateOneFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const {
    userId,
    fullName,
    phone,
    email,
    date,
    destination,
    address,
    status,
    type,
    ielts,
    ieltsScore,
    appointmentDate,
    location,
    applicationCode,
    sscYear,
    sscDepartment,
    sscCGPA,
    hscYear,
    hscDepartment,
    hscCGPA,
    bachelorYear,
    bachelorDepartment,
    bachelorCGPA,
    agree1,
    agree2,
    assignedTo,
  } = req.body;

  const data = {
    fullName: fullName === "" ? undefined : fullName,
    managementId: userId,
    type: type === "" ? undefined : type,
    status: status === "" ? undefined : status,
    phone: phone === "" ? undefined : phone,
    email: email === "" ? undefined : email,
    date: date === "" ? undefined : date,
    destination: destination === "" ? undefined : destination,
    address: address === "" ? undefined : address,
    ielts: ielts === "" ? undefined : ielts,
    ieltsScore: ieltsScore === "" ? undefined : ieltsScore,
    appointmentDate: appointmentDate === "" ? undefined : appointmentDate,
    location: location === "" ? undefined : location,
    applicationCode: applicationCode === "" ? undefined : applicationCode,

    sscYear: sscYear === "" ? undefined : sscYear,
    sscDepartment: sscDepartment === "" ? undefined : sscDepartment,
    sscCGPA: sscCGPA === "" ? undefined : sscCGPA,

    hscYear: hscYear === "" ? undefined : hscYear,
    hscDepartment: hscDepartment === "" ? undefined : hscDepartment,
    hscCGPA: hscCGPA === "" ? undefined : hscCGPA,

    bachelorYear: bachelorYear === "" ? undefined : bachelorYear,
    bachelorDepartment:
      bachelorDepartment === "" ? undefined : bachelorDepartment,
    bachelorCGPA: bachelorCGPA === "" ? undefined : bachelorCGPA,

    agree1: agree1 === "" ? undefined : agree1,
    agree2: agree2 === "" ? undefined : agree2,
  };

  // ✅ only if assignedTo is valid
  if (assignedTo && assignedTo !== "") {
    const user = await User.findOne({
      where: {
        id: assignedTo,
      },
    });

    if (user) {
      data.user_id = user.id;
      data.assignedTo = `${user.FirstName} ${user.LastName}`;
    }
  }

  const result = await ConsultationService.updateOneFromDB(id, data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Consultation updated successfully!",
    data: result,
  });
});

const deleteIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("deleteId", id);

  const result = await ConsultationService.deleteIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Consultation delete successfully!!",
    data: result,
  });
});

const ConsultationController = {
  getAllFromDB,
  getDataById,
  getLeadInfoById,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
};

module.exports = ConsultationController;
