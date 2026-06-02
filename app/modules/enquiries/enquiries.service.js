const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const { EnquiriesSearchAbleFields } = require("./enquiries.constants");
const NotificationService = require("../notification/notification.service");
const Enquiries = db.enquiries;
const User = db.user;

const insertIntoDB = async (data) => {
  const { Branch, user_id } = data;

  console.log("EnquiriesData", data);

  // Create enquiry — create() returns the created object
  const result = await Enquiries.create(data);

  if (!result) {
    throw new Error("Failed to create enquiry.");
  }

  // Prepare notification payload
  const notificationData = {
    message: `Request enquiry for ${Branch}`,
    branch: Branch,
    url: "manage-enquiries",
    userId: user_id,
  };

  // Send notification
  await NotificationService.createNotification(notificationData);

  console.log("Enquiries", result);

  return result;
};

// const getAllFromDB = async (filters, options) => {
//   const { page, limit, skip } = paginationHelpers.calculatePagination(options);
//   const { branch, user_id } = filters;

//   let whereConditions = {};
//   let result = [];
//   let total = 0;

//   // If only branch
//    if (branch) {
//     whereConditions = { branch: { [Op.eq]: branch } };
//     result = await Enquiries.findAll({
//       where: whereConditions,
//       offset: skip,
//       limit,
//       order: options.sortBy && options.sortOrder
//         ? [[options.sortBy, options.sortOrder.toUpperCase()]]
//         : [['createdAt', 'ASC']],
//     });

//     total = await Enquiries.count({ where: whereConditions });

//     if (result.length === 0) {
//       whereConditions = {};
//       result = await Enquiries.findAll({
//         where: whereConditions,
//         offset: skip,
//         limit,
//         order: options.sortBy && options.sortOrder
//           ? [[options.sortBy, options.sortOrder.toUpperCase()]]
//           : [['createdAt', 'ASC']],
//       });

//       total = await Enquiries.count();
//     }
//   }

//   // If no filters at all — show all data
//   else {
//     whereConditions = {};
//     result = await Enquiries.findAll({
//       where: whereConditions,
//       offset: skip,
//       limit,
//       order: options.sortBy && options.sortOrder
//         ? [[options.sortBy, options.sortOrder.toUpperCase()]]
//         : [['createdAt', 'ASC']],
//     });

//     total = await Enquiries.count();
//   }

//   return {
//     meta: { total, page, limit },
//     data: result,
//   };
// };

// const getAllFromDB = async (filters, options) => {
//     const { page, limit, skip } = paginationHelpers.calculatePagination(options);
//     const { searchTerm, ...filterData } = filters;

//     const buildWhereConditions = () => {
//       const where = {};

//       if (searchTerm) {
//         where[Op.or] = EnquiriesSearchAbleFields.map(field => ({
//           [field]: { [Op.iLike]: `%${searchTerm}%` },
//         }));
//       }

//       if (Object.keys(filterData).length > 0) {
//         const orConditions = Object.entries(filterData).map(([key, value]) => ({
//           [key]: { [Op.eq]: value },
//         }));

//         if (where[Op.or]) {
//           where[Op.or].push(...orConditions);
//         } else {
//           where[Op.or] = orConditions;
//         }
//       }

//       return where;
//     };

//     // Initial filtering query
//     let whereConditions = buildWhereConditions();

//     let result = await Enquiries.findAll({
//       where: whereConditions,
//       offset: skip,
//       limit,
//       order: options.sortBy && options.sortOrder
//         ? [[options.sortBy, options.sortOrder.toUpperCase()]]
//         : [['createdAt', 'DESC']],
//     });

//     let total = await Enquiries.count({ where: whereConditions });

//     // If no results, fetch all data without filtering
//     // if (result.length === 0) {
//     //   whereConditions = {}; // Clear filters
//     //   result = await Task.findAll({
//     //     offset: skip,
//     //     limit,
//     //     order: options.sortBy && options.sortOrder
//     //       ? [[options.sortBy, options.sortOrder.toUpperCase()]]
//     //       : [['createdAt', 'ASC']],
//     //   });
//     //   total = await Task.count(); // Count all records
//     // }

//     return {
//       meta: { total, page, limit },
//       data: result,
//     };
//   };

const getAllFromDB = async (filters, options) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  let where = {};

  // Only exact match for searchTerm
  if (searchTerm) {
    where[Op.or] = EnquiriesSearchAbleFields.map((field) => ({
      [field]: { [Op.eq]: searchTerm },
    }));
  }

  if (Object.keys(filterData).length > 0) {
    const andConditions = Object.entries(filterData).map(([key, value]) => ({
      [key]: { [Op.eq]: value },
    }));

    if (where[Op.or]) {
      where = {
        [Op.and]: [where, ...andConditions],
      };
    } else {
      where = {
        [Op.and]: andConditions,
      };
    }
  }

  const result = await Enquiries.findAll({
    where,
    offset: skip,
    limit,
    order:
      options.sortBy && options.sortOrder
        ? [[options.sortBy, options.sortOrder.toUpperCase()]]
        : [["createdAt", "DESC"]],
  });

  const total = await Enquiries.count({ where });

  return {
    meta: { total, page, limit },
    data: result,
  };
};

const getAllDataById = async (id) => {
  const result = await Enquiries.findAll({
    where: {
      user_id: id,
    },
  });

  return result;
};

const deleteIdFromDB = async (id) => {
  const result = await Enquiries.destroy({
    where: {
      id: id,
    },
  });

  return result;
};

const updateOneFromDB = async (id, data) => {
  const { Branch, user_id } = data;

  const result = await Enquiries.update(data, {
    where: {
      id: id,
    },
  });

  if (!result) {
    throw new Error("Failed to create enquiry.");
  }

  // Prepare notification payload
  const notificationData = {
    message: `Request enquiry for ${Branch}`,
    branch: Branch,
    url: "manage-enquiries",
    userId: user_id,
  };

  // Send notification
  await NotificationService.createNotification(notificationData);

  console.log("Enquiries", result);

  return result;
};

const EnquiriesService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getAllDataById,
};

module.exports = EnquiriesService;
