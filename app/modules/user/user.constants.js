// const UserSearchAbleFields = ["FirstName", "LastName", "Status", "id", "Email"];
// const UserFilterAbleFileds = [
//   "searchTerm",
//   "Branch",
//   "FirstName",
//   "LastName",
//   "Profile",
//   "Role",
//   "Status",
//   "id",
//   "Email",
// ]; // Now used for exact filter

// module.exports = {
//   UserFilterAbleFileds,
//   UserSearchAbleFields,
// };

const UserFilterAbleFileds = [
  "searchTerm",
  "roleMode",
  "Branch",
  "FirstName",
  "LastName",
  "Profile",
  "Role",
  "Status",
  "id",
  "Email",
]; // Now used for exact filter

const STUDENT_STATUSES = [
  "File Opened",
  "Application Submitted",
  "Interview Date Received",
  "Offer Received",
  "LOA Received",
  "Visa Applied",
  "Visa Received",
  "Rejected",
];

const UserSearchAbleFields = [
  "Branch",
  "FirstName",
  "LastName",
  "Profile",
  "Role",
  "Status",
  "id",
  "Email",
];

module.exports = {
  STUDENT_STATUSES,
  UserFilterAbleFileds,
  UserSearchAbleFields,
};
