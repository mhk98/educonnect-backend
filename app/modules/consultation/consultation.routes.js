const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle, uploadPdf } = require("../../middlewares/upload");
const ConsultationController = require("./consultation.controller");
const router = require("express").Router();

router.post("/create",  ConsultationController.insertIntoDB);
router.get("/", ConsultationController.getAllFromDB);
router.get("/lead-info/:id", ConsultationController.getLeadInfoById);
router.get("/:id", ConsultationController.getDataById);
router.delete("/:id", ConsultationController.deleteIdFromDB);
router.put("/:id", ConsultationController.updateOneFromDB);

const ConsultationRoutes = router;
module.exports =  ConsultationRoutes ;
