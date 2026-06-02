const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const { CommissionSearchAbleFields } = require("./commission.constants");
const ApiError = require("../../../error/ApiError");
const Commission = db.commission;
const User = db.user;
const Notification = db.notification;

const insertIntoDB = async (payload) => {
  const { amount, user_id, purpose, id, assignor } = payload;

  console.log("payload", payload);
  // ✅ Find user
  const user = await User.findOne({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const data = {
    amount,
    assignedTo_id: user.id,
    user_id,
    assignor,
    assignedTo: `${user.FirstName} ${user.LastName}`,
    purpose,
    Branch: user.Branch,
    status: "PENDING",
  };
  console.log("data", data);
  const result = await Commission.create(data);

    if (!result) {
      throw new ApiError("Commission create failed")
    }

    const notificationData = {
      message: `${user.Branch} Branch pay ${amount} Taka for ${purpose}`,
      branch: user.Branch,
      userId: id,
      url: "commission-payments",
  }

      await Notification.create(notificationData);

  return result;
};

const getAllFromDB = async (filters, options) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const buildWhereConditions = () => {
    const where = {};

    if (searchTerm) {
      where[Op.or] = CommissionSearchAbleFields.map((field) => ({
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

  let result = await Commission.findAll({
    where: whereConditions,
    offset: skip,
    limit,
    order:
      options.sortBy && options.sortOrder
        ? [[options.sortBy, options.sortOrder.toUpperCase()]]
        : [["createdAt", "ASC"]],
  });

  let total = await Commission.count({ where: whereConditions });

  return {
    meta: { total, page, limit },
    data: result,
  };
};

const getAllDataById = async (id) => {
  const result = await Commission.findAll({
    where: {
      user_id: id,
    },
  });

  return result;
};

const deleteIdFromDB = async (id) => {
  const result = await Commission.destroy({
    where: {
      id: id,
    },
  });

  return result;
};

const updateOneFromDB = async (id, payload) => {
  const { status } = payload;

  const result = await Commission.update(payload, {
    where: {
      id: id,
    },
  });

  if(!result){
    throw new ApiError(400, "Failed to update commission")
  }
   const commission = await Commission.findOne({
    where: { id:id },
  });

     const user = await User.findOne({
    where: { id:commission.user_id },
  });

  if (!user) {
    throw new Error("User not found.");
  }
 
   const notificationData = {
      message: `${commission.Branch} ${status} commission ${commission.amount}`,
      branch: user.Branch,
      userId: user.id,
      url: "commission-payments",
  }

      await Notification.create(notificationData);

  return result;
};

const CommissionService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getAllDataById,
};

module.exports = CommissionService;
