const { Op } = require("sequelize");
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const { TaskSearchAbleFields, TASK_STATUSES } = require("./task.constants");
const { logActivity } = require("../taskActivity/taskActivity.service");

const Task = db.task;
const User = db.user;

const insertIntoDB = async (data) => {
  return await Task.create(data);
};

const getAllDataById = async (user_id) => {
  return await Task.findAll({
    where: { user_id },
    order: [["createdAt", "DESC"]],
  });
};

const getAllFromDB = async (filters, options) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  console.log("searchTerm", searchTerm);
  console.log("filterData", filterData);
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      [Op.or]: TaskSearchAbleFields.map((field) => ({
        [field]: { [Op.like]: `%${searchTerm}%` }, // ✅ MySQL
      })),
    });
  }

  // Object.entries(filterData).forEach(([key, value]) => {
  //   if (value === undefined || value === null || value === "") return;

  //   if (key === "status" && !TASK_STATUSES.includes(value)) {
  //     throw new ApiError(400, "Invalid status filter");
  //   }

  //   andConditions.push({ [key]: { [Op.eq]: value } });
  // });

  //   Object.entries(filterData).forEach(([key, value]) => {
  //   if (value === undefined || value === null || value === "") return;

  //   // ✅ Status validation
  //   if (key === "status" && !TASK_STATUSES.includes(value)) {
  //     throw new ApiError(400, "Invalid status filter");
  //   }

  //   // ✅ Branch special logic
  //   if (key === "branch") {
  //     andConditions.push({
  //       [Op.or]: [
  //         { branch: { [Op.eq]: value } },
  //         { branch: { [Op.eq]: "Edu Anchor" } },
  //       ],
  //     });
  //     return;
  //   }

  //   // ✅ Default exact match
  //   andConditions.push({ [key]: { [Op.eq]: value } });
  // });

  // Object.entries(filterData).forEach(([key, value]) => {
  //   if (value === undefined || value === null || value === "") return;

  //   // ✅ Status validation
  //   if (key === "status" && !TASK_STATUSES.includes(value)) {
  //     throw new ApiError(400, "Invalid status filter");
  //   }

  //   // ✅ Branch logic (FIXED)
  //   if (key === "branch") {
  //     // 🔹 Edu Anchor → show all data (no branch filter)
  //     if (value === "Edu Anchor") {
  //       return; // ❗️branch condition add করবো না
  //     }

  //     // 🔹 Other branches → own branch + Edu Anchor
  //     andConditions.push({
  //       [Op.or]: [
  //         { branch: { [Op.eq]: value } },
  //         { branch: { [Op.eq]: "Edu Anchor" } },
  //       ],
  //     });
  //     return;
  //   }

  //   // ✅ Default exact match
  //   andConditions.push({ [key]: { [Op.eq]: value } });
  // });

  Object.entries(filterData).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    // ✅ Status validation
    if (key === "status" && !TASK_STATUSES.includes(value)) {
      throw new ApiError(400, "Invalid status filter");
    }

    // ✅ Branch logic (FINAL)
    if (key === "branch") {
      // 🔹 Edu Anchor → see ALL branches (no branch condition)
      if (value === "Edu Anchor") {
        return;
      }

      // 🔹 Other branches → ONLY own branch
      andConditions.push({
        branch: { [Op.eq]: value },
      });
      return;
    }

    // ✅ Other filters (assignedTo_id, user_id, etc.)
    andConditions.push({ [key]: { [Op.eq]: value } });
  });

  const whereConditions = andConditions.length
    ? { [Op.and]: andConditions }
    : {};

  const result = await Task.findAll({
    where: whereConditions,
    offset: skip,
    limit,
    // include: [
    //   {
    //     model: User,
    //     attributes: ["id", "FirstName", "LastName", "image"],
    //   },
    // ],

    include: [
      {
        model: User,
        as: "assignee",
        attributes: ["id", "FirstName", "LastName", "image"],
      },
      {
        model: User,
        as: "creator",
        attributes: ["id", "FirstName", "LastName", "image"],
      },
      {
        model: User,
        as: "linkedStudent",
        attributes: ["id", "FirstName", "LastName", "image"],
      },
    ],

    order:
      options.sortBy && options.sortOrder
        ? [[options.sortBy, options.sortOrder.toUpperCase()]]
        : [["createdAt", "DESC"]],
  });

  const total = await Task.count({ where: whereConditions });

  return {
    meta: { total, page, limit },
    data: result,
  };
};

// const getOverviewCountsFromDB = async (filters = {}) => {
//   const where = {};

//   // ✅ Branch special logic (FIXED)
//   if (filters.branch) {
//     if (filters.branch !== "Edu Anchor") {
//       // 🔹 Other branches → own + Edu Anchor
//       where[Op.or] = [{ branch: filters.branch }, { branch: "Edu Anchor" }];
//     }
//     // 🔹 Edu Anchor → no branch filter (show all)
//   }

//   if (filters.user_id) where.user_id = filters.user_id;
//   if (filters.assignedTo_id) where.assignedTo_id = filters.assignedTo_id;

//   const rows = await Task.findAll({
//     attributes: [
//       "status",
//       [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
//     ],
//     where,
//     group: ["status"],
//     raw: true,
//   });

//   const map = Object.fromEntries(TASK_STATUSES.map((s) => [s, 0]));
//   rows.forEach((r) => {
//     map[r.status] = Number(r.count);
//   });

//   return map;
// };

const getOverviewCountsFromDB = async (filters = {}) => {
  const where = {};

  // ✅ FINAL Branch logic
  if (filters.branch) {
    // 🔹 Edu Anchor → ALL branches (no filter)
    if (filters.branch !== "Edu Anchor") {
      // 🔹 Other branches → ONLY own branch
      where.branch = filters.branch;
    }
  }

  // ✅ Other filters stay same
  if (filters.user_id) where.user_id = filters.user_id;
  if (filters.assignedTo_id) where.assignedTo_id = filters.assignedTo_id;

  const rows = await Task.findAll({
    attributes: [
      "status",
      [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
    ],
    where,
    group: ["status"],
    raw: true,
  });

  // ensure all statuses exist
  const map = Object.fromEntries(TASK_STATUSES.map((status) => [status, 0]));

  rows.forEach((r) => {
    map[r.status] = Number(r.count);
  });

  return map;
};

const deleteIdFromDB = async (id) => {
  return await Task.destroy({ where: { id } });
};

// const updateOneFromDB = async (id, data) => {
//   const task = await Task.findByPk(id);
//   if (!task) throw new ApiError(404, "Task not found");

//   if (data.status && !TASK_STATUSES.includes(data.status)) {
//     throw new ApiError(400, "Invalid status");
//   }

//   await task.update(data);

//   return await Task.findByPk(id, {
//     include: [
//       {
//         model: User,
//         as: "assignee",
//         attributes: ["id", "FirstName", "LastName", "image"],
//       },
//     ],
//   });
// };

const updateOneFromDB = async (id, data, actionUserId) => {
  const task = await Task.findByPk(id);
  if (!task) throw new ApiError(404, "Task not found");
  console.log("Incoming status:", data.status);

  if (data.status && !TASK_STATUSES.includes(data.status)) {
    throw new ApiError(400, "Invalid status");
  }

  // 🔒 old values ধরলাম
  const oldStatus = task.status;
  const oldAssignee = task.assignedTo_id;

  await task.update(data);

  // 🔥 STATUS CHANGE ACTIVITY
  if (data.status && oldStatus !== data.status) {
    await logActivity({
      task_id: task.id,
      user_id: actionUserId,
      action: "STATUS_CHANGED",
      from_value: oldStatus,
      to_value: data.status,
    });
  }

  // 🔥 ASSIGN / REASSIGN ACTIVITY
  if (data.assignedTo_id && oldAssignee !== data.assignedTo_id) {
    await logActivity({
      task_id: task.id,
      user_id: actionUserId,
      action: "ASSIGNED",
      from_value: oldAssignee,
      to_value: data.assignedTo_id,
    });
  }

  return await Task.findByPk(id, {
    include: [
      {
        model: User,
        as: "assignee",
        attributes: ["id", "FirstName", "LastName", "image"],
      },
    ],
  });
};

module.exports = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getAllDataById,
  getOverviewCountsFromDB,
};
