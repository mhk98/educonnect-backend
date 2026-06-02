const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadPdf } = require("../../middlewares/upload");
const AdditionalDocumentController = require("./additionalDocument.controller");
const router = require("express").Router();

router.post("/create", uploadPdf, AdditionalDocumentController.insertIntoDB);
router.get("/", AdditionalDocumentController.getAllFromDB);
router.get("/:id", AdditionalDocumentController.getDataById);
router.delete("/:id", AdditionalDocumentController.deleteIdFromDB);
router.put("/:id", uploadPdf, AdditionalDocumentController.updateOneFromDB);

const AdditionalDocumentRoutes = router;
module.exports = AdditionalDocumentRoutes;
