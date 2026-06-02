const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const { ConsultationSearchAbleFields } = require("./consultation.constants");
const NotificationService = require("../notification/notification.service");
const ApiError = require("../../../error/ApiError");
const Consultation = db.consultation;
const User = db.user;
const Profile = db.profile;
const Document = db.document;
const Academic = db.academic;
const Tests = db.tests;
const Contract = db.contract;
const bcrypt = require("bcryptjs");

// const insertIntoDB = async (payload) => {
//   const { url, location, userId, sscYear, hscYear, bachelorYear } = payload;

//   const result = await Consultation.create(payload);

//   if (!result) {
//     throw new ApiError(400, "Failed to create lead");
//   }
//   const notificationData = {
//     message: `New lead for ${location} Branch`,
//     branch: location,
//     url: "leads",
//     userId: userId,
//   };

//   await NotificationService.createNotification(notificationData);

//   return result;
// };

const insertIntoDB = async (payload) => {
  const { url, location, userId, sscYear, hscYear, bachelorYear } = payload;

  const toNumberOrNull = (value) => {
    if (value === "" || value === undefined || value === null) return null;
    const num = Number(value);
    return Number.isNaN(num) ? null : num;
  };

  const data = {
    ...payload,
    sscYear: toNumberOrNull(sscYear),
    hscYear: toNumberOrNull(hscYear),
    bachelorYear: toNumberOrNull(bachelorYear),
  };

  const result = await Consultation.create(data);

  if (!result) {
    throw new ApiError(400, "Failed to create lead");
  }

  const notificationData = {
    message: `New lead for ${location} Branch`,
    branch: location,
    url: "leads",
    userId: userId,
  };

  await NotificationService.createNotification(notificationData);

  return result;
};

// const getAllFromDB = async (filters, options) => {
//   const { page, limit, skip } = paginationHelpers.calculatePagination(options);
//   const { searchTerm, startDate, endDate, ...filterData } = filters;

//   const where = {};

//   // Optional: Search functionality (currently not used)
//   if (searchTerm) {
//     where[Op.or] = ConsultationSearchAbleFields.map(field => ({
//       [field]: { [Op.like]: `%${searchTerm}%` },
//     }));
//   }

//   // Apply exact match filters for all other fields
//   Object.entries(filterData).forEach(([key, value]) => {
//     if (value !== '') {
//       where[key] = { [Op.eq]: value };
//     }
//   });

//   if (startDate && endDate) {
//   const start = new Date(`${startDate}T00:00:00+06:00`);
//   const end = new Date(`${endDate}T23:59:59+06:00`);

//   console.log("Corrected BETWEEN range:", start.toISOString(), end.toISOString());

//   where.createdAt = {
//     [Op.between]: [start, end],
//   };
// }
//   // Query with filters
//   const result = await Consultation.findAll({
//     where,
//     offset: skip,
//     limit,
//     order: options.sortBy && options.sortOrder
//       ? [[options.sortBy, options.sortOrder.toUpperCase()]]
//       : [['createdAt', 'DESC']],
//   });

//   const total = await Consultation.count({ where });

//   return {
//     meta: { total, page, limit },
//     data: result,
//   };
// };

// const getAllFromDB = async (filters, options) => {
//   const { page, limit, skip } = paginationHelpers.calculatePagination(options);
//   const { searchTerm, startDate, endDate, user_id, role, ...filterData } =
//     filters;

//   const where = {};

//   // Search term support (if any)
//   if (searchTerm) {
//     where[Op.or] = ConsultationSearchAbleFields.map((field) => ({
//       [field]: { [Op.like]: `%${searchTerm}%` },
//     }));
//   }

//   // Basic field filters
//   Object.entries(filterData).forEach(([key, value]) => {
//     if (value !== "") {
//       where[key] = { [Op.eq]: value };
//     }
//   });

//   // Date filtering (for Success Case or other)
//   if (startDate && endDate) {
//     const start = new Date(`${startDate}T00:00:00+06:00`);
//     const end = new Date(`${endDate}T23:59:59+06:00`);
//     where.createdAt = {
//       [Op.between]: [start, end],
//     };
//   }

//   // ✅ Assigned leads access control logic for EMPLOYEE only
//   if (role === "employee" && user_id) {
//     where[Op.or] = [
//       { user_id: null }, // everyone can see unassigned
//       { user_id: user_id }, // only the assigned employee
//     ];
//   }

//   // Fetch data
//   const result = await Consultation.findAll({
//     where,
//     offset: skip,
//     limit,
//     order:
//       options.sortBy && options.sortOrder
//         ? [[options.sortBy, options.sortOrder.toUpperCase()]]
//         : [["createdAt", "DESC"]],
//   });

//   const total = await Consultation.count({ where });

//   return {
//     meta: { total, page, limit },
//     data: result,
//   };
// };

const getAllFromDB = async (filters, options) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  const { searchTerm, startDate, endDate, role, ...filterData } = filters;

  // console.log("filtersUserId", filterData.user_id);

  const andConditions = [];

  // 🔍 Search (optional)
  if (searchTerm) {
    andConditions.push({
      [Op.or]: ConsultationSearchAbleFields.map((field) => ({
        [field]: {
          [Op.like]: `%${searchTerm}%`,
        },
      })),
    });
  }

  // 🎯 Basic filters
  Object.entries(filterData).forEach(([key, value]) => {
    if (value !== "" && value !== undefined) {
      andConditions.push({
        [key]: value,
      });
    }
  });

  // 📅 Date range filter (createdAt)
  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    andConditions.push({
      createdAt: {
        [Op.between]: [start, end],
      },
    });
  } else if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    andConditions.push({
      createdAt: {
        [Op.gte]: start,
      },
    });
  } else if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    andConditions.push({
      createdAt: {
        [Op.lte]: end,
      },
    });
  }

  // 👨‍💼 Employee access control
  if (role === "employee" && filterData.user_id) {
    andConditions.push({
      [Op.or]: [{ user_id: null }, { user_id: filterData.user_id }],
    });
  }

  andConditions.push({
    status: {
      [Op.ne]: "Case Converted",
    },
  });

  // 🧠 Final where clause
  const where =
    andConditions.length > 0
      ? {
          [Op.and]: andConditions,
        }
      : {};

  // 📦 Fetch data
  const result = await Consultation.findAll({
    where,
    offset: skip,
    limit,
    order:
      options.sortBy && options.sortOrder
        ? [[options.sortBy, options.sortOrder.toUpperCase()]]
        : [["createdAt", "DESC"]],
  });

  const total = await Consultation.count({ where });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id) => {
  const result = await Consultation.findOne({
    where: {
      id: id,
    },
  });

  return result;
};

const getLeadInfoById = async (id) => {
  const result = await Consultation.findOne({
    where: {
      student_id: id,
    },
  });

  return result;
};

const deleteIdFromDB = async (id) => {
  const result = await Consultation.destroy({
    where: {
      id: id,
    },
  });

  return result;
};

// const updateOneFromDB = async (id, payload) => {
//   const { managementId, location, status } = payload;
//   const result = await Consultation.update(payload, {
//     where: {
//       id: id,
//     },
//   });

//   if (!result) {
//     throw new ApiError(400, "Failed to update lead");
//   }

//   const lead = await Consultation.findOne({
//     where: {
//       id: id,
//     },
//   });

//   const newPassword = "12345";
//   let Password;

//   // ✅ শুধু তখনই hash করবে যদি newPassword থাকে
//   if (newPassword && newPassword.trim() !== "") {
//     const salt = await bcrypt.genSalt(10);
//     Password = await bcrypt.hash(newPassword, salt);
//   }

//   if (status === "Case Converted") {
//     const student = await User.create({
//       Email: lead.email,
//       Phone: lead.phone,
//       Password,
//       Role: "student",
//       Branch: location,
//     });

//     if (student) {
//       await Consultation.update(
//         { student_id: student.id },
//         { where: { id: id } },
//       );
//     }

//     await Profile.create({ user_id: student.id });
//     // await Application.create({user_id:result.id})
//     await Document.create({ user_id: student.id });
//     await Academic.create({ user_id: student.id });
//     await Tests.create({ user_id: student.id });
//     await Contract.create({ user_id: student.id });
//   }

//   const notificationData = {
//     message: `Update ${location} Branch student ${lead.fullName} lead info`,
//     branch: location,
//     url: `lead/${id}`,
//     userId: managementId,
//   };

//   await NotificationService.createNotification(notificationData);

//   return result;
// };

const updateOneFromDB = async (id, payload) => {
  const { managementId, location, status } = payload;

  return await db.sequelize.transaction(async (t) => {
    // 1️⃣ Update consultation
    const [updatedCount] = await Consultation.update(payload, {
      where: { id },
      transaction: t,
    });

    if (!updatedCount) {
      throw new ApiError(400, "Failed to update lead");
    }

    // 2️⃣ Get updated lead
    const lead = await Consultation.findOne({
      where: { id },
      transaction: t,
    });

    // 3️⃣ Case Converted logic
    if (status === "Case Converted") {
      // ✅ Check if already converted
      if (lead.student_id) {
        throw new ApiError(400, "Student already created for this lead");
      }

      // ✅ Check existing user
      const existingUser = await User.findOne({
        where: { Email: lead.email },
        transaction: t,
      });

      let student = existingUser;

      if (!student) {
        // 🔐 Generate password
        const rawPassword = "12345"; // 👉 better: random generate করো
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);

        student = await User.create(
          {
            Email: lead.email,
            Phone: lead.phone,
            Password: hashedPassword,
            Role: "student",
            Branch: lead.location,
          },
          { transaction: t },
        );
      }

      // 4️⃣ Update consultation with student_id
      await Consultation.update(
        { ...payload, student_id: student.id },
        { where: { id }, transaction: t },
      );

      // 5️⃣ Create related data (safe)
      await Promise.all([
        Profile.create({ user_id: student.id }, { transaction: t }),
        Document.create({ user_id: student.id }, { transaction: t }),
        Academic.create({ user_id: student.id }, { transaction: t }),
        Tests.create({ user_id: student.id }, { transaction: t }),
        Contract.create({ user_id: student.id }, { transaction: t }),
      ]);
    }

    // 6️⃣ Notification
    await NotificationService.createNotification({
      message: `Update ${location} Branch student ${lead.fullName} lead info`,
      branch: lead.location,
      url: `lead/${id}`,
      userId: managementId,
    });

    return { success: true };
  });
};

const ConsultationService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
  getLeadInfoById,
};

module.exports = ConsultationService;
