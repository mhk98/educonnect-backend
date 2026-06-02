const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadPdf } = require("../../middlewares/upload");
const LeadDocumentController = require("./leadDocument.controller");
const router = require("express").Router();

router.post("/create", uploadPdf, LeadDocumentController.insertIntoDB);
router.get("/:id", LeadDocumentController.getAllFromDB);
// router.get("/:id", LeadDocumentController.getDataById);
router.delete("/:id", LeadDocumentController.deleteIdFromDB);
router.put("/:id", uploadPdf, LeadDocumentController.updateOneFromDB);

const LeadDocumentRoutes = router;
module.exports =  LeadDocumentRoutes ;
