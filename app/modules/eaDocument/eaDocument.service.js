const { Op, where } = require("sequelize"); // Ensure Op is imported
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const EADocument = db.eaDocument;
const User = db.user;
const Notification = db.notification;

const insertIntoDB = async (info, filePath) => {
  const data = {
    ...info, // Spread all properties like title, institution, user_id, etc.
    file: filePath,
  };

  const { userId, user_id } = info;

  // 1️⃣ User check
  const student = await User.findOne({ where: { id: user_id } });
  if (!student) {
    throw new Error("student not found.");
  }

  console.log("data", data);
  const result = await EADocument.create(data);

  if (!result) {
    throw new ApiError(400, "Failed to create ea document");
  }

  // 3️⃣ Create notification if update was successful

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
        message: `EA document for ${user.Branch} branch student ${student.FirstName} ${student.LastName}`,
        branch: user.Branch,
        url: `editprofile/${student.id}`,
      })
    )
  );

  return result;
};

const getAllFromDB = async (id) => {
  const result = await EADocument.findAll({
    where: {
      user_id: id,
    },
  });

  return result;
};

// const getDataById = async (id) => {

//   console.log("dataid", id)
//   const result = await EADocument.findOne(
//    {
//     where:{
//       id:id
//     }
//    }
// )

//   return result
// };

const deleteIdFromDB = async (id) => {
  const result = await EADocument.destroy({
    where: {
      id: id,
    },
  });

  return result;
};

const updateOneFromDB = async (id, payload) => {
  console.log("payload", payload);

  const result = await EADocument.update(payload, {
    where: {
      id: id,
    },
  });

  return result;
};

const AdditionalEADocumentService = {
  getAllFromDB,
  insertIntoDB,
  deleteIdFromDB,
  updateOneFromDB,
  // getDataById,
};

module.exports = AdditionalEADocumentService;
