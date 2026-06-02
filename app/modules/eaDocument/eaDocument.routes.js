const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadPdf } = require("../../middlewares/upload");
const EADocumentController = require("./eaDocument.controller");
const router = require("express").Router();

router.post("/create", uploadPdf, EADocumentController.insertIntoDB);
router.get("/:id", EADocumentController.getAllFromDB);
// router.get("/:id", EADocumentController.getDataById);
router.delete("/:id", EADocumentController.deleteIdFromDB);
router.put("/:id", uploadPdf, EADocumentController.updateOneFromDB);

const EADocumentRoutes = router;
module.exports =  EADocumentRoutes ;
