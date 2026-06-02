// const TaskSearchAbleFields = []; // Empty if you're not using search
// const TaskFilterAbleFileds = [ 'user_id', 'assignedTo_id']; // Now used for exact filter

// module.exports = {
//    TaskSearchAbleFields,
//    TaskFilterAbleFileds
// }

const TaskSearchAbleFields = [
  "task",
  "description",
  "branch",
  "status"
];
// searchTerm চাইলে এগুলোতে search হবে

const TaskFilterAbleFileds = [ "branch", "assignedTo_id", "user_id","status", "searchTerm"];
// exact filter

const TASK_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING",
  "IN_REVIEW",
  "COMPLETED",
  "BLOCKED",
];

module.exports = {
  TaskSearchAbleFields,
  TaskFilterAbleFileds,
  TASK_STATUSES,
};
