const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const { ApplicationSearchAbleFields } = require("./application.constants");
const Application = db.application;
const ProgramCountry = db.programCountry;
const ProgramUniversity = db.programUniversity;
const User = db.user;

const insertIntoDB = async (data) => {
  const {
    year,
    intake,
    university,
    program,
    priority,
    country,
    status,
    assignee,
    user_id,
    FirstName,
    LastName,
    image,
    Email,
    Password,
    Phone,
    Role,
    Profile,
    CreatedOn,
    Branch,
    Address,
    RegionalStatus,
  } = data;

  // ✅ Find user
  const userInfo = await User.findOne({
    where: { id: user_id },
  });

  if (!userInfo) {
    throw new Error("User not found.");
  }

  // ✅ Count existing applications for the user
  const existingCount = await Application.count({
    where: { user_id: user_id },
  });

  const applicationSeq = existingCount + 1;

  // ✅ Generate application acknowledge code: EA001/1, EA001/2 etc.
  const acknowledgeCode = `${userInfo.id}-${applicationSeq}`;

  const countryInfo = await ProgramCountry.findOne({
    where: {
      id: country,
    },
  });

  if (!countryInfo) {
    throw new Error("Country not found.");
  }

  const universityInfo = await ProgramUniversity.findOne({
    where: {
      id: university,
      country_id: country,
    },
  });

  if (!universityInfo) {
    throw new Error("University not found.");
  }

  const info = {
    year,
    intake,
    university: universityInfo.university,
    program,
    priority,
    country: countryInfo.country,
    user_id,
    FirstName: userInfo.FirstName,
    LastName: userInfo.LastName,
    Branch: userInfo.Branch,
    assignee,
    status,
    acknowledge: acknowledgeCode,
  };

  // ✅ Update user's assigned person and status
  // const userDataUpdate = {
  //   Assigned: assignee,
  //   Status: status,
  // };

  const userDataUpdate = {
    FirstName: FirstName === "" ? undefined : FirstName,
    LastName: LastName === "" ? undefined : LastName,
    Email: Email === "" ? undefined : Email,
    Password: Password === "" ? undefined : Password,
    Phone: Phone === "" ? undefined : Phone,
    Role: Role === "" ? undefined : Role,
    Profile: Profile === "" ? undefined : Profile,
    Assigned: assignee === "" ? undefined : assignee,
    Status: status === "" ? undefined : status,
    Branch: Branch === "" ? undefined : Branch,
    Address: Address === "" ? undefined : Address,
    RegionalStatus: RegionalStatus === "" ? undefined : RegionalStatus,
    CreatedOn: CreatedOn === "" ? undefined : CreatedOn,
    image: image === undefined ? undefined : image,
  };

  await User.update(userDataUpdate, {
    where: {
      id: user_id,
    },
  });

  // ✅ Create application
  const result = await Application.create(info);

  console.log("Application Created:", result);
  return result;
};

const getAllFromDB = async (filters, options) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const buildWhereConditions = () => {
    const where = {};

    // Apply searchTerm logic (partial match)
    if (searchTerm) {
      where[Op.or] = ApplicationSearchAbleFields.map((field) => ({
        [field]: { [Op.iLike]: `%${searchTerm}%` },
      }));
    }

    // Check how many fields are matched (non-empty values)
    const exactMatchFields = Object.entries(filterData).filter(
      ([_, value]) => value !== undefined && value !== ""
    );

    if (exactMatchFields.length > 0) {
      const orConditions = exactMatchFields.map(([key, value]) => ({
        [key]: { [Op.eq]: value },
      }));

      // Combine searchTerm OR with filter OR
      if (where[Op.or]) {
        where[Op.or].push(...orConditions);
      } else {
        where[Op.or] = orConditions;
      }
    }

    // If nothing matched, return empty object (will return all data)
    return where;
  };

  const whereConditions = buildWhereConditions();

  const result = await Application.findAll({
    where: whereConditions,
    offset: skip,
    limit,
    order:
      options.sortBy && options.sortOrder
        ? [[options.sortBy, options.sortOrder.toUpperCase()]]
        : [["createdAt", "ASC"]],
  });

  const total = await Application.count({ where: whereConditions });

  return {
    meta: { total, page, limit },
    data: result,
  };
};

const getAllDataById = async (id) => {
  const result = await Application.findAll({
    where: {
      user_id: id,
    },
  });

  return result;
};

const getAllApplications = async (filters, options) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, startDate, endDate, ...filterData } = filters;

  const where = {};

  // Optional: Exact match on searchTerm fields
  if (searchTerm) {
    where[Op.or] = ApplicationSearchAbleFields.map((field) => ({
      [field]: { [Op.eq]: searchTerm }, // 👈 use Op.eq for exact match
    }));
  }

  // Apply exact match filters for remaining fields
  Object.entries(filterData).forEach(([key, value]) => {
    if (value !== "") {
      where[key] = { [Op.eq]: value };
    }
  });

  // Date range filter (createdAt between startDate and endDate)
  if (startDate && endDate) {
    const start = new Date(`${startDate}T00:00:00+06:00`);
    const end = new Date(`${endDate}T23:59:59+06:00`);

    console.log(
      "Corrected BETWEEN range:",
      start.toISOString(),
      end.toISOString()
    );

    where.createdAt = {
      [Op.between]: [start, end],
    };
  }

  // Query with exact match filters
  const result = await Application.findAll({
    where,
    // offset: skip,
    // limit,
    order:
      options.sortBy && options.sortOrder
        ? [[options.sortBy, options.sortOrder.toUpperCase()]]
        : [["createdAt", "DESC"]],
  });

  const total = await Application.count({ where });

  // return {
  //   meta: { total, page, limit },
  //   data: result,
  // };

  return result;
};

const deleteIdFromDB = async (acknowledge) => {
  console.log("acknowledge", acknowledge);

  const result = await Application.destroy({
    where: {
      acknowledge: acknowledge,
    },
  });

  return result;
};

const updateOneFromDB = async (id, payload) => {
  const {
    year,
    intake,
    university,
    program,
    priority,
    country,
    status,
    image,
    assignee,
    user_id,
    FirstName,
    LastName,
    Email,
    Password,
    Phone,
    Role,
    Profile,
    CreatedOn,
    Branch,
    Address,
    RegionalStatus,
  } = payload;

  const userInfo = await User.findOne({
    where: { id: user_id },
  });

  const info = {
    year: year === "" ? undefined : year,
    intake: intake === "" ? undefined : intake,
    university: university === "" ? undefined : university,
    program: program === "" ? undefined : program,
    priority: priority === "" ? undefined : priority,
    country: country === "" ? undefined : country,
    Branch: Branch === "" ? undefined : Branch,
    user_id: user_id === "" ? undefined : user_id,
    FirstName: userInfo?.FirstName === "" ? undefined : userInfo?.FirstName,
    LastName: userInfo?.LastName === "" ? undefined : userInfo?.LastName,
    assignee: assignee === "" ? undefined : assignee,
    status: status === "" ? undefined : status,
  };

  console.log("info", info);

  const userDataUpdate = {
    FirstName: FirstName === "" ? undefined : FirstName,
    LastName: LastName === "" ? undefined : LastName,
    Email: Email === "" ? undefined : Email,
    Password: Password === "" ? undefined : Password,
    Phone: Phone === "" ? undefined : Phone,
    Role: Role === "" ? undefined : Role,
    Profile: Profile === "" ? undefined : Profile,
    Assigned: assignee === "" ? undefined : assignee,
    Status: status === "" ? undefined : status,
    Branch: Branch === "" ? undefined : Branch,
    Address: Address === "" ? undefined : Address,
    RegionalStatus: RegionalStatus === "" ? undefined : RegionalStatus,
    CreatedOn: CreatedOn === "" ? undefined : CreatedOn,
    image: image === undefined ? undefined : image,
  };

  const result = await Application.update(info, {
    where: {
      id: id,
      user_id: user_id,
    },
  });

  await User.update(userDataUpdate, {
    where: {
      id: user_id,
    },
  });

  // const result = await Application.update(info, {
  //   where: {
  //     id: id,
  //     user_id: user_id,
  //   }
  // });

  return result;
};

const ApplicationService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getAllDataById,
  getAllApplications,
};

module.exports = ApplicationService;
