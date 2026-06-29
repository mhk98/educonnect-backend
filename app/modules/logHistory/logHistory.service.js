const { Op } = require("sequelize");
const db = require("../../../models");

const LogHistory = db.logHistory;

let tableReady = false;

const ensureTable = async () => {
  if (tableReady) return;
  await LogHistory.sync();
  tableReady = true;
};

const getAllFromDB = async ({ branch } = {}) => {
  await ensureTable();

  const where = {};

  if (branch) {
    where.branch = branch;
  }

  return await LogHistory.findAll({
    where,
    order: [["createdAt", "DESC"]],
  });
};

const getBranchOptions = async ({ branch } = {}) => {
  await ensureTable();

  const where = branch ? { branch } : { branch: { [Op.ne]: null } };

  const rows = await LogHistory.findAll({
    where,
    attributes: ["branch"],
    group: ["branch"],
    order: [["branch", "ASC"]],
  });

  return rows.map((row) => row.branch).filter(Boolean);
};

module.exports = {
  ensureTable,
  getAllFromDB,
  getBranchOptions,
};
