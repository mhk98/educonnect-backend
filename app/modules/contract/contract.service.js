const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const Contract = db.contract;
const User = db.user;
const Notification = db.notification;

const insertIntoDB = async (data) => {
  console.log("data", data);
  const result = await Contract.create(data);

  return result;
};

const getAllFromDB = async () => {
  const result = await Contract.findAll();

  return result;
};

const getDataById = async (id) => {
  const result = await Contract.findOne({
    where: {
      user_id: id,
    },
  });

  return result;
};

const deleteIdFromDB = async (id) => {
  const result = await Contract.destroy({
    where: {
      id: id,
    },
  });

  return result;
};

const updateOneFromDB = async (id, payload) => {
  console.log("payload", payload);

  const {
    registrationFees,
    visaDocumentsFees,
    serviceCharge,
    spouseServicecharge,
    applicationCode,
    note,
    user_id,
    userId,
  } = payload;

  const data = {
    registrationFees: registrationFees === "" ? undefined : registrationFees,
    visaDocumentsFees: visaDocumentsFees === "" ? undefined : visaDocumentsFees,
    serviceCharge: serviceCharge === "" ? undefined : serviceCharge,
    spouseServicecharge:
      spouseServicecharge === "" ? undefined : spouseServicecharge,
    applicationCode: applicationCode === "" ? undefined : applicationCode,
    note: note === "" ? undefined : note,
    user_id: user_id === "" ? undefined : user_id,
  };

  const result = await Contract.update(data, {
    where: {
      user_id: id,
    },
  });

  if (!result) {
    throw new ApiError(400, "Failed to update contract");
  }
  // 3️⃣ Create notification if update was successful

  // 1️⃣ User check
  const student = await User.findOne({ where: { id: user_id } });
  if (!student) {
    throw new Error("User not found.");
  }

  const users = await User.findAll({
    where: {
      [Op.or]: [
        { Branch: "Edu Anchor" }, // 🔹 Edu Anchor branch
        { Branch: student.Branch }, // 🔹 ইনপুট branch
      ],
      id: { [Op.ne]: userId },
    },
  });

  console.log("Target users (excluding sender):", users.length);

  if (!users.length) {
    console.log("No users found in this branch (excluding sender).");
    return [];
  }

  // 2️⃣ Create notification for each remaining user
  await Promise.all(
    users.map((user) =>
      Notification.create({
        userId: user.id,
        message: `${user.Branch} branch student ${student.FirstName} ${student.LastName} update your contract details`,
        branch: user.Branch,
        url: `editprofile/${user.id}`,
      })
    )
  );

  return result;
};

const ContractService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  getDataById,
};

module.exports = ContractService;
