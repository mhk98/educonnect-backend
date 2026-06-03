const db = require("../../../models");
const QuickLink = db.quickLink;

const insertIntoDB = async (data) => {
  const result = await QuickLink.create(data);
  return result;
};

const getAllFromDB = async () => {
  const result = await QuickLink.findAll({ order: [["order", "ASC"], ["id", "ASC"]] });
  return result;
};

const updateOneFromDB = async (id, payload) => {
  await QuickLink.update(payload, { where: { id } });
  return QuickLink.findOne({ where: { id } });
};

const deleteIdFromDB = async (id) => {
  const result = await QuickLink.destroy({ where: { id } });
  return result;
};

const QuickLinkService = {
  insertIntoDB,
  getAllFromDB,
  updateOneFromDB,
  deleteIdFromDB,
};

module.exports = QuickLinkService;
