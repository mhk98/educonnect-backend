const db = require("../../../models");

const TaskActivity = db.taskActivity;

const logActivity = async ({
  task_id,
  user_id,
  action,
  from_value = null,
  to_value = null,
  meta = {},
}) => {
  return await TaskActivity.create({
    task_id,
    user_id,
    action,
    from_value,
    to_value,
    meta,
  });
};

const getActivityByTask = async (task_id) => {
  return await TaskActivity.findAll({
    where: { task_id },
    include: [
      {
        model: db.user,
        attributes: ["id", "FirstName", "LastName", "image"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

module.exports = {
  logActivity,
  getActivityByTask,
};
