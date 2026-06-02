const express = require("express");
const UserRoutes = require("../modules/user/user.routes");
const ProfileRoutes = require("../modules/profile/profile.routes");
const ApplicationRoutes = require("../modules/application/application.routes");
const AcademicRoutes = require("../modules/academic/academic.routes");
const TestsRoutes = require("../modules/tests/tests.routes");
const DocumentRoutes = require("../modules/document/document.routes");
const StudentCommentRoutes = require("../modules/studentComment/studentComment.routes");
const StudentReplyRoutes = require("../modules/studentReply/studentReply.routes");
const KCCommentRoutes = require("../modules/kcComment/kcComment.routes");
const KCReplyRoutes = require("../modules/kcReply/kcReply.routes");
const AdditionalDocumentRoutes = require("../modules/additionalDocument/additionalDocument.routes");
const ProgramYearRoutes = require("../modules/programYear/programYear.routes");
const ProgramCountryRoutes = require("../modules/programCountry/programCountry.routes");
const ProgramIntakeRoutes = require("../modules/programIntake/programIntake.routes");
const ProgramNameRoutes = require("../modules/programName/programName.routes");
const ProgramUniversityRoutes = require("../modules/programUniversity/programUniversity.routes");
const RequestPaymentRoutes = require("../modules/requestPayment/requestPayment.routes");
const PendingPaymentRoutes = require("../modules/pendingPayment/pendingPayment.routes");
const PreviousPaymentRoutes = require("../modules/previousPayment/previousPayment.routes");
const PaymentRoutes = require("../modules/payment/payment.routes");
const CashInRoutes = require("../modules/cashIn/cashIn.routes");
const CashOutRoutes = require("../modules/cashOut/cashOut.routes");
const EnquiriesRoutes = require("../modules/enquiries/enquiries.routes");
const CommissionRoutes = require("../modules/commission/commission.routes");
const CommentRoutes = require("../modules/comment/comment.routes");
const ReplyRoutes = require("../modules/reply/reply.routes");
const TaskRoutes = require("../modules/task/task.routes");
const TaskCommentRoutes = require("../modules/taskComment/taskComment.routes");
const TaskActivityRoutes = require("../modules/taskActivity/taskActivity.routes");
const ContractRoutes = require("../modules/contract/contract.routes");
const EADocumentRoutes = require("../modules/eaDocument/eaDocument.routes");
const ConsultationRoutes = require("../modules/consultation/consultation.routes");
const ContactRoutes = require("../modules/contact/contact.routes");
const LeadCommentRoutes = require("../modules/leadComment/leadComment.routes");
const LeadReplyRoutes = require("../modules/leadReply/leadReply.routes");
const LeadDocumentRoutes = require("../modules/leadDocument/leadDocument.routes");
const PixelRoutes = require("../modules/pixel/pixel.routes");
const NotificationRoutes = require("../modules/notification/notification.routes");
const NoticeRoutes = require("../modules/notice/notice.routes");
const BranchRoutes = require("../modules/branch/branch.routes");
const CountryRoutes = require("../modules/country/country.routes");

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },

  {
    path: "/profile",
    route: ProfileRoutes,
  },
  {
    path: "/notice",
    route: NoticeRoutes,
  },

  {
    path: "/application",
    route: ApplicationRoutes,
  },

  {
    path: "/academic",
    route: AcademicRoutes,
  },

  {
    path: "/tests",
    route: TestsRoutes,
  },

  {
    path: "/document",
    route: DocumentRoutes,
  },

  {
    path: "/studentComment",
    route: StudentCommentRoutes,
  },

  {
    path: "/studentReply",
    route: StudentReplyRoutes,
  },

  {
    path: "/kcComment",
    route: KCCommentRoutes,
  },

  {
    path: "/kcReply",
    route: KCReplyRoutes,
  },
  {
    path: "/additionalDocument",
    route: AdditionalDocumentRoutes,
  },

  {
    path: "/programYear",
    route: ProgramYearRoutes,
  },
  {
    path: "/programCountry",
    route: ProgramCountryRoutes,
  },
  {
    path: "/programIntake",
    route: ProgramIntakeRoutes,
  },
  {
    path: "/programName",
    route: ProgramNameRoutes,
  },
  {
    path: "/programUniversity",
    route: ProgramUniversityRoutes,
  },
  {
    path: "/requestPayment",
    route: RequestPaymentRoutes,
  },
  {
    path: "/pendingPayment",
    route: PendingPaymentRoutes,
  },
  {
    path: "/previousPayment",
    route: PreviousPaymentRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/cashIn",
    route: CashInRoutes,
  },
  {
    path: "/cashOut",
    route: CashOutRoutes,
  },
  {
    path: "/enquiries",
    route: EnquiriesRoutes,
  },
  {
    path: "/commission",
    route: CommissionRoutes,
  },
  {
    path: "/consultation",
    route: ConsultationRoutes,
  },
  {
    path: "/contact",
    route: ContactRoutes,
  },
  {
    path: "/branch",
    route: BranchRoutes,
  },
  {
    path: "/country",
    route: CountryRoutes,
  },
  {
    path: "/comment",
    route: CommentRoutes,
  },

  {
    path: "/reply",
    route: ReplyRoutes,
  },
  {
    path: "/leadComment",
    route: LeadCommentRoutes,
  },

  {
    path: "/leadReply",
    route: LeadReplyRoutes,
  },

  {
    path: "/task",
    route: TaskRoutes,
  },
  {
    path: "/taskComment",
    route: TaskCommentRoutes,
  },
  {
    path: "/taskActivity",
    route: TaskActivityRoutes,
  },

  {
    path: "/contract",
    route: ContractRoutes,
  },
  {
    path: "/eaDocument",
    route: EADocumentRoutes,
  },
  {
    path: "/leadDocument",
    route: LeadDocumentRoutes,
  },
  {
    path: "/pixel",
    route: PixelRoutes,
  },
  {
    path: "/notification",
    route: NotificationRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
module.exports = router;
