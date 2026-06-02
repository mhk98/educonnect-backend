const { where, Op } = require("sequelize");
const { generateToken } = require("../../../helpers/jwtHelpers");
const db = require("../../../models");
const User = db.user;
const Profile = db.profile;
const Document = db.document;
const Academic = db.academic;
const Tests = db.tests;
const Contract = db.contract;

const bcrypt = require("bcryptjs");
const ApiError = require("../../../error/ApiError");
const paginationHelpers = require("../../../helpers/paginationHelper");
const { UserSearchAbleFields, STUDENT_STATUSES } = require("./user.constants");

const login = async (data) => {
  const { Email, Password } = data;
  console.log(data);

  // Validate request data
  if (!Email || !Password) {
    throw new ApiError(400, "Email number is required.");
  }

  // Find user by email
  const user = await User.findOne({ where: { Email } });
  if (!user) {
    throw new ApiError(
      404,
      "No user found with this email. Please create an account first.",
    );
  }

  // Validate password
  const isPasswordValid = bcrypt.compareSync(Password, user.Password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect password or email.");
  }

  // Generate JWT access token
  const accessToken = generateToken(user);

  // Set access token in cookie
  const cookieOptions = {
    secure: process.env.NODE_ENV === "production", // Fixed environment check
    httpOnly: true,
    sameSite: "None",
  };
  // res.cookie("accessToken", accessToken, cookieOptions);

  const result = {
    accessToken,
    user,
  };

  return result;
};

const register = async (data) => {
  const { Email } = data;

  const isUserExist = await User.findOne({
    where: { Email: Email },
  });

  if (isUserExist) {
    throw new ApiError(409, "User already exist");
  }

  const result = await User.create(data);
  await Profile.create({ user_id: result.id });
  // await Application.create({user_id:result.id})
  await Document.create({ user_id: result.id });
  await Academic.create({ user_id: result.id });
  await Tests.create({ user_id: result.id });
  await Document.create({ user_id: result.id });
  await Contract.create({ user_id: result.id });

  return result;
};

// const getAllFromDB = async (filters, options) => {
//   const { page, limit, skip } = paginationHelpers.calculatePagination(options);
//   const { searchTerm, ...filterData } = filters;

//   const buildWhereConditions = () => {
//     const where = {};

//     if (searchTerm) {
//       where[Op.or] = UserSearchAbleFields.map((field) => ({
//         [field]: { [Op.iLike]: `%${searchTerm}%` },
//       }));
//     }

//     if (Object.keys(filterData).length > 0) {
//       const orConditions = Object.entries(filterData).map(([key, value]) => ({
//         [key]: { [Op.eq]: value },
//       }));

//       if (where[Op.or]) {
//         where[Op.or].push(...orConditions);
//       } else {
//         where[Op.or] = orConditions;
//       }
//     }

//     return where;
//   };

//   // Initial filtering query
//   let whereConditions = buildWhereConditions();

//   let result = await User.findAll({
//     where: whereConditions,
//     offset: skip,
//     limit,
//     order:
//       options.sortBy && options.sortOrder
//         ? [[options.sortBy, options.sortOrder.toUpperCase()]]
//         : [["createdAt", "ASC"]],
//   });

//   let total = await User.count({ where: whereConditions });

//   // If no results, fetch all data without filtering
//   if (result.length === 0) {
//     whereConditions = {}; // Clear filters
//     result = await User.findAll({
//       offset: skip,
//       limit,
//       order:
//         options.sortBy && options.sortOrder
//           ? [[options.sortBy, options.sortOrder.toUpperCase()]]
//           : [["createdAt", "ASC"]],
//     });
//     total = await User.count(); // Count all records
//   }

//   return {
//     meta: { total, page, limit },
//     data: result,
//   };
// };

// const getAllFromDB = async (filters, paginationOptions) => {
//   const { page, limit, skip, sortBy, sortOrder } =
//     paginationHelpers.calculatePagination(paginationOptions);

//   const { searchTerm, ...filtersData } = filters;

//   const andConditions = [];

//   // 🔍 Search
//   if (searchTerm) {
//     andConditions.push({
//       [Op.or]: UserSearchAbleFields.map((field) => ({
//         [field]: {
//           [Op.like]: `%${searchTerm}%`,
//         },
//       })),
//     });
//   }

//   // 🎯 Exact filters
//   if (Object.keys(filtersData).length > 0) {
//     andConditions.push({
//       [Op.and]: Object.entries(filtersData).map(([field, value]) => ({
//         [field]: value,
//       })),
//     });
//   }

//   const whereConditions =
//     andConditions.length > 0 ? { [Op.and]: andConditions } : {};

//   /* ---------------- SORT ---------------- */
//   const order = [];
//   if (sortBy && sortOrder) {
//     order.push([sortBy, sortOrder]);
//   }

//   /* ---------------- QUERY ---------------- */
//   const result = await User.findAll({
//     where: whereConditions,
//     order,
//     offset: skip,
//     limit,
//   });

//   const total = await User.count({
//     where: whereConditions,
//   });

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };

const getAllFromDB = async (filters, paginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, roleMode, ...rawFilters } = filters;

  const andConditions = [];

  /* 🔍 SEARCH */
  if (searchTerm) {
    andConditions.push({
      [Op.or]: UserSearchAbleFields.map((field) => ({
        [field]: { [Op.like]: `%${searchTerm}%` },
      })),
    });
  }

  /* 🎭 ROLE MODE */
  if (roleMode === "excludeStudent") {
    andConditions.push({ Role: { [Op.ne]: "student" } });
  }

  if (roleMode === "onlyStudent") {
    andConditions.push({ Role: "student" });
  }

  /* 🧹 CLEAN FILTERS (🔥 THIS IS THE FIX) */
  const filtersData = Object.fromEntries(
    Object.entries(rawFilters).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined,
    ),
  );

  /* 🎯 EXACT FILTER */
  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      [Op.and]: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { [Op.and]: andConditions } : {};

  const order = [];
  if (sortBy && sortOrder) order.push([sortBy, sortOrder]);

  const result = await User.findAll({
    where: whereConditions,
    order,
    offset: skip,
    limit,
  });

  const total = await User.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getAllActiveStudentFromDB = async (filters) => {
  // const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const buildWhereConditions = () => {
    const where = {};

    if (searchTerm) {
      where[Op.or] = UserSearchAbleFields.map((field) => ({
        [field]: { [Op.iLike]: `%${searchTerm}%` },
      }));
    }

    if (Object.keys(filterData).length > 0) {
      const orConditions = Object.entries(filterData).map(([key, value]) => ({
        [key]: { [Op.eq]: value },
      }));

      if (where[Op.or]) {
        where[Op.or].push(...orConditions);
      } else {
        where[Op.or] = orConditions;
      }
    }

    return where;
  };

  // Initial filtering query
  let whereConditions = buildWhereConditions();

  let result = await User.findAll({
    where: whereConditions,
    // offset: skip,
    // limit,
    // order: options.sortBy && options.sortOrder
    //   ? [[options.sortBy, options.sortOrder.toUpperCase()]]
    //   : [['createdAt', 'ASC']],
  });

  let total = await User.count({ where: whereConditions });

  // If no results, fetch all data without filtering
  if (result.length === 0) {
    whereConditions = {}; // Clear filters
    result = await User.findAll({
      // offset: skip,
      // limit,
      // order: options.sortBy && options.sortOrder
      //   ? [[options.sortBy, options.sortOrder.toUpperCase()]]
      //   : [['createdAt', 'ASC']],
    });
    total = await User.count(); // Count all records
  }

  return {
    // meta: { total, page, limit },
    data: result,
  };
};

const getOverviewCountsFromDB = async (filters = {}) => {
  const where = {};

  // ✅ FINAL Branch logic
  if (filters.Branch) {
    // 🔹 Edu Anchor → ALL branches (no filter)
    if (filters.Branch !== "Edu Anchor") {
      // 🔹 Other branches → ONLY own branch
      where.Branch = filters.Branch;
    }
  }

  // ✅ Other filters stay same
  if (filters.Role) where.Role = filters.Role;

  const rows = await User.findAll({
    attributes: [
      "status",
      [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
    ],
    where,
    group: ["status"],
    raw: true,
  });

  // ensure all statuses exist
  const map = Object.fromEntries(STUDENT_STATUSES.map((status) => [status, 0]));

  rows.forEach((r) => {
    map[r.status] = Number(r.count);
  });

  return map;
};

const getUserById = async (id) => {
  const result = await User.findOne({
    where: {
      id: id,
    },
  });

  return result;
};

const deleteUserFromDB = async (id) => {
  if (!id) throw new Error("User ID is required");

  const result = await User.destroy({
    where: { id },
  });

  if (result === 0) {
    console.log("No user found with the given ID.");
    return { success: false, message: "User not found" };
  }

  return result;
};

const updateUserFromDB = async (id, payload) => {
  console.log("payload", payload);
  const result = await User.update(payload, {
    where: {
      id: id,
    },
  });

  return result;
};

const updateUserPasswordFromDB = async (id, payload) => {
  console.log("id", id);
  const { currentPassword, newPassword, confirmNewPassword } = payload;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    throw new ApiError("All password fields are required.", 400);
  }

  if (newPassword !== confirmNewPassword) {
    throw new ApiError("New passwords do not match.", 400);
  }

  // Fetch the user from the database
  const user = await User.findByPk(id);
  if (!user) {
    throw new ApiError("User not found.", 404);
  }

  // Verify the current password
  const isMatch = await bcrypt.compare(currentPassword, user.Password);
  if (!isMatch) {
    throw new ApiError("Current password is incorrect.", 401);
  }

  // Hash and update the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update the password in the database
  const result = await User.update(
    { Password: hashedPassword }, // Hash the new password
    { where: { id } }, // Update the password for the given user id
  );

  return result;
};

const UserService = {
  getAllFromDB,
  login,
  register,
  deleteUserFromDB,
  updateUserFromDB,
  getUserById,
  updateUserPasswordFromDB,
  getAllActiveStudentFromDB,
  getOverviewCountsFromDB,
};

module.exports = UserService;
