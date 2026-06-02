const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const { BranchSearchAbleFields } = require("./branch.constants");
const Branch = db.branch;
const User = db.user;

const insertIntoDB = async (payload) => {
  const result = await Branch.create(payload);

  return result;
};

const getAllFromDB = async (filters, options) => {
  // const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const buildWhereConditions = () => {
    const where = {};

    if (searchTerm) {
      where[Op.or] = BranchSearchAbleFields.map((field) => ({
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

  let result = await Branch.findAll({
    where: whereConditions,
    // offset: skip,
    // limit,
    order:
      options.sortBy && options.sortOrder
        ? [[options.sortBy, options.sortOrder.toUpperCase()]]
        : [["createdAt", "ASC"]],
  });

  let total = await Branch.count({ where: whereConditions });

  // return {
  //   meta: { total, page, limit },
  //   data: result,
  // };

  return result;
};

const getAllDataById = async (id) => {
  const result = await Branch.findAll({
    where: {
      user_id: id,
    },
  });

  return result;
};

const deleteIdFromDB = async (id) => {
  const result = await Branch.destroy({
    where: {
      id: id,
    },
  });

  return result;
};

const updateOneFromDB = async (id, payload) => {
  const result = await Branch.update(payload, {
    where: {
      id: id,
    },
  });

  return result;
};

const BranchService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getAllDataById,
};

module.exports = BranchService;
