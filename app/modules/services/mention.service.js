const db = require("../../../models");
const User = db.user;


const resolveMentionedUsers = async (names = []) => {
  if (!names.length) return [];

  return await User.findAll({
    where: {
      FirstName: names,
    },
    attributes: ["id", "FirstName", "LastName", "Email"],
  });
};

module.exports = {
  resolveMentionedUsers,
};
