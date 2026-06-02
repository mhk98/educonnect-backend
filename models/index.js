// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require("../db/db");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DataTypes } = require("sequelize");

// Define models
db.user = require("../app/modules/user/user.model")(db.sequelize, DataTypes);
db.profile = require("../app/modules/profile/profile.model")(
  db.sequelize,
  DataTypes,
);
db.application = require("../app/modules/application/application.model")(
  db.sequelize,
  DataTypes,
);
db.notice = require("../app/modules/notice/notice.model")(
  db.sequelize,
  DataTypes,
);
db.academic = require("../app/modules/academic/academic.model")(
  db.sequelize,
  DataTypes,
);
db.notification = require("../app/modules/notification/notification.model")(
  db.sequelize,
  DataTypes,
);
db.tests = require("../app/modules/tests/tests.model")(db.sequelize, DataTypes);
db.document = require("../app/modules/document/document.model")(
  db.sequelize,
  DataTypes,
);
db.studentComment =
  require("../app/modules/studentComment/studentComment.model")(
    db.sequelize,
    DataTypes,
  );
db.studentReply = require("../app/modules/studentReply/studentReply.model")(
  db.sequelize,
  DataTypes,
);
db.kcComment = require("../app/modules/kcComment/kcComment.model")(
  db.sequelize,
  DataTypes,
);
db.kcReply = require("../app/modules/kcReply/kcReply.model")(
  db.sequelize,
  DataTypes,
);
db.document = require("../app/modules/document/document.model")(
  db.sequelize,
  DataTypes,
);
db.additionalDocument =
  require("../app/modules/additionalDocument/additionalDocument.model")(
    db.sequelize,
    DataTypes,
  );
db.programYear = require("../app/modules/programYear/programYear.model")(
  db.sequelize,
  DataTypes,
);
db.programCountry =
  require("../app/modules/programCountry/programCountry.model")(
    db.sequelize,
    DataTypes,
  );
db.programIntake = require("../app/modules/programIntake/programIntake.model")(
  db.sequelize,
  DataTypes,
);
db.programName = require("../app/modules/programName/programName.model")(
  db.sequelize,
  DataTypes,
);
db.programUniversity =
  require("../app/modules/programUniversity/programUniversity.model")(
    db.sequelize,
    DataTypes,
  );
db.requestPayment =
  require("../app/modules/requestPayment/requestPayment.model")(
    db.sequelize,
    DataTypes,
  );
db.pendingPayment =
  require("../app/modules/pendingPayment/pendingPayment.model")(
    db.sequelize,
    DataTypes,
  );
db.payment = require("../app/modules/payment/payment.model")(
  db.sequelize,
  DataTypes,
);
db.cashIn = require("../app/modules/cashIn/cashIn.model")(
  db.sequelize,
  DataTypes,
);
db.cashOut = require("../app/modules/cashOut/cashOut.model")(
  db.sequelize,
  DataTypes,
);
db.enquiries = require("../app/modules/enquiries/enquiries.model")(
  db.sequelize,
  DataTypes,
);
db.commission = require("../app/modules/commission/commission.model")(
  db.sequelize,
  DataTypes,
);
db.consultation = require("../app/modules/consultation/consultation.model")(
  db.sequelize,
  DataTypes,
);
db.contact = require("../app/modules/contact/contact.model")(
  db.sequelize,
  DataTypes,
);
db.branch = require("../app/modules/branch/branch.model")(
  db.sequelize,
  DataTypes,
);
db.country = require("../app/modules/country/country.model")(
  db.sequelize,
  DataTypes,
);
db.comment = require("../app/modules/comment/comment.model")(
  db.sequelize,
  DataTypes,
);
db.reply = require("../app/modules/reply/reply.model")(db.sequelize, DataTypes);
db.task = require("../app/modules/task/task.model")(db.sequelize, DataTypes);
db.contract = require("../app/modules/contract/contract.model")(
  db.sequelize,
  DataTypes,
);
db.eaDocument = require("../app/modules/eaDocument/eaDocument.model")(
  db.sequelize,
  DataTypes,
);
db.leadDocument = require("../app/modules/leadDocument/leadDocument.model")(
  db.sequelize,
  DataTypes,
);

db.leadComment = require("../app/modules/leadComment/leadComment.model")(
  db.sequelize,
  DataTypes,
);
db.leadReply = require("../app/modules/leadReply/leadReply.model")(
  db.sequelize,
  DataTypes,
);
db.leadComment.hasMany(db.leadReply, {
  foreignKey: "comment_id",
  as: "leadReplies", // Must match the alias used in your include
});
db.leadReply.belongsTo(db.leadComment, {
  foreignKey: "comment_id",
  as: "leadComments",
});

db.user.hasMany(db.consultation, { foreignKey: "user_id" });
db.consultation.belongsTo(db.user, { foreignKey: "user_id" });

db.user.hasMany(db.consultation, { foreignKey: "student_id" });
db.consultation.belongsTo(db.user, { foreignKey: "student_id" });

db.user.hasMany(db.leadComment, { foreignKey: "user_id" });
db.leadComment.belongsTo(db.user, { foreignKey: "user_id" });

//lead comment relation
db.user.hasMany(db.leadReply, { foreignKey: "user_id" });
db.leadReply.belongsTo(db.user, { foreignKey: "user_id" });

db.consultation.hasMany(db.leadComment, { foreignKey: "lead_id" });
db.leadComment.belongsTo(db.consultation, { foreignKey: "lead_id" });

db.consultation.hasMany(db.leadDocument, { foreignKey: "lead_id" });
db.leadDocument.belongsTo(db.consultation, { foreignKey: "lead_id" });

db.comment.hasMany(db.reply, {
  foreignKey: "comment_id",
  as: "replies", // Must match the alias used in your include
});
db.reply.belongsTo(db.comment, {
  foreignKey: "comment_id",
  as: "comment",
});

// ✅ StudentComment - StudentReply association (WITH correct alias)
db.studentComment.hasMany(db.studentReply, {
  foreignKey: "studentComment_id",
  as: "studentReplies", // Must match the alias used in your include
});
db.studentReply.belongsTo(db.studentComment, {
  foreignKey: "studentComment_id",
  as: "studentComment",
});

db.kcComment.hasMany(db.kcReply, {
  foreignKey: "kcComment_id",
  as: "kcReplies", // Must match the alias used in your include
});
db.kcReply.belongsTo(db.kcComment, {
  foreignKey: "kcComment_id",
  as: "kcComment",
});

// 🔁 User associations
db.user.hasMany(db.profile, { foreignKey: "user_id" });
db.profile.belongsTo(db.user, { foreignKey: "user_id" });

db.user.hasMany(db.application, { foreignKey: "user_id" });
db.application.belongsTo(db.user, { foreignKey: "user_id" });

db.user.hasMany(db.document, { foreignKey: "user_id" });
db.document.belongsTo(db.user, { foreignKey: "user_id" });

db.user.hasMany(db.additionalDocument, { foreignKey: "user_id" });
db.additionalDocument.belongsTo(db.user, { foreignKey: "user_id" });

db.programCountry.hasMany(db.programUniversity, { foreignKey: "country_id" });
db.programUniversity.belongsTo(db.programCountry, { foreignKey: "country_id" });

db.programCountry.hasMany(db.programName, { foreignKey: "country_id" });
db.programName.belongsTo(db.programCountry, { foreignKey: "country_id" });

db.programUniversity.hasMany(db.programName, { foreignKey: "university_id" });
db.programName.belongsTo(db.programUniversity, { foreignKey: "university_id" });

db.user.hasMany(db.academic, { foreignKey: "user_id" });
db.academic.belongsTo(db.user, { foreignKey: "user_id" });

db.user.hasMany(db.tests, { foreignKey: "user_id" });
db.tests.belongsTo(db.user, { foreignKey: "user_id" });

db.user.hasMany(db.studentComment, { foreignKey: "user_id" });
db.studentComment.belongsTo(db.user, { foreignKey: "user_id" });

db.user.hasMany(db.studentReply, { foreignKey: "user_id" });
db.studentReply.belongsTo(db.user, { foreignKey: "user_id" });

// 🔁 Application associations
db.application.hasMany(db.studentComment, { foreignKey: "application_id" });
db.studentComment.belongsTo(db.application, { foreignKey: "application_id" });

db.user.hasMany(db.kcComment, { foreignKey: "user_id" });
db.kcComment.belongsTo(db.user, { foreignKey: "user_id" });

db.user.hasMany(db.kcReply, { foreignKey: "user_id" });
db.kcReply.belongsTo(db.user, { foreignKey: "user_id" });

// 🔁 Application associations
db.application.hasMany(db.kcComment, { foreignKey: "application_id" });
db.kcComment.belongsTo(db.application, { foreignKey: "application_id" });

db.user.hasMany(db.comment, { foreignKey: "user_id" });
db.comment.belongsTo(db.user, { foreignKey: "user_id" });

db.user.hasMany(db.reply, { foreignKey: "user_id" });
db.reply.belongsTo(db.user, { foreignKey: "user_id" });

// 🔁 Application associations
db.enquiries.hasMany(db.comment, { foreignKey: "enquiry_id" });
db.comment.belongsTo(db.enquiries, { foreignKey: "enquiry_id" });

db.user.hasMany(db.enquiries, { foreignKey: "user_id" });
db.enquiries.belongsTo(db.user, { foreignKey: "user_id" });

db.user.hasMany(db.pendingPayment, { foreignKey: "user_id" });
db.pendingPayment.belongsTo(db.user, { foreignKey: "user_id" });

// db.requestPayment.hasMany(db.pendingPayment, { foreignKey: "requestPayment_id" });
// db.pendingPayment.belongsTo(db.requestPayment, { foreignKey: "requestPayment_id" });

db.user.hasMany(db.requestPayment, { foreignKey: "user_id" });
db.requestPayment.belongsTo(db.user, { foreignKey: "user_id" });

// db.user.hasMany(db.task, { foreignKey: "user_id" });
// db.task.belongsTo(db.user, { foreignKey: "user_id" });

// db.user.hasMany(db.requestPayment, { foreignKey: "assignedTo_id" });
// db.requestPayment.belongsTo(db.user, { foreignKey: "assignedTo_id" });

// creator relationship
db.user.hasMany(db.task, { foreignKey: "student_id", as: "linkedStudents" });
db.task.belongsTo(db.user, { foreignKey: "student_id", as: "linkedStudent" });

// creator relationship
db.user.hasMany(db.task, { foreignKey: "user_id", as: "createdTasks" });
db.task.belongsTo(db.user, { foreignKey: "user_id", as: "creator" });

// assignee relationship
db.user.hasMany(db.task, { foreignKey: "assignedTo_id", as: "assignedTasks" });
db.task.belongsTo(db.user, { foreignKey: "assignedTo_id", as: "assignee" });

db.user.hasMany(db.commission, { foreignKey: "user_id" });
db.commission.belongsTo(db.user, { foreignKey: "user_id" });

db.user.hasMany(db.contract, { foreignKey: "user_id" });
db.contract.belongsTo(db.user, { foreignKey: "user_id" });

db.user.hasMany(db.eaDocument, { foreignKey: "user_id" });
db.eaDocument.belongsTo(db.user, { foreignKey: "user_id" });

// task comment relation
db.taskComment = require("../app/modules/taskComment/taskComment.model")(
  db.sequelize,
  DataTypes,
);

// relations
db.task.hasMany(db.taskComment, {
  foreignKey: "task_id",
  as: "comments",
});
db.taskComment.belongsTo(db.task, {
  foreignKey: "task_id",
});

db.user.hasMany(db.taskComment, {
  foreignKey: "user_id",
});
db.taskComment.belongsTo(db.user, {
  foreignKey: "user_id",
});

//task activity model
db.taskActivity = require("../app/modules/taskActivity/taskActivity.model")(
  db.sequelize,
  DataTypes,
);

// relations
db.task.hasMany(db.taskActivity, {
  foreignKey: "task_id",
  as: "activities",
});
db.taskActivity.belongsTo(db.task, {
  foreignKey: "task_id",
});

db.user.hasMany(db.taskActivity, {
  foreignKey: "user_id",
});
db.taskActivity.belongsTo(db.user, {
  foreignKey: "user_id",
});

// ❌ Removed redundant duplicate `studentComment` - `studentReply` mapping
// (already defined above)

// ✅ Sync the database
db.sequelize
  .sync({ force: false }) // don't use `force: true` in production
  .then(() => {
    console.log("Connection re-synced successfully");
  })
  .catch((err) => {
    console.error("Error on re-sync:", err);
  });

module.exports = db;
