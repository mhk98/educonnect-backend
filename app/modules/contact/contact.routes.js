const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle, uploadPdf } = require("../../middlewares/upload");
const ContactController = require("./contact.controller");
const router = require("express").Router();

router.post("/create", uploadPdf, ContactController.insertIntoDB);
router.get("/", ContactController.getAllFromDB);
router.get("/:id", ContactController.getAllDataById);
router.delete("/:id", ContactController.deleteIdFromDB);
router.put("/:id", uploadPdf, ContactController.updateOneFromDB);

const ContactRoutes = router;
module.exports =  ContactRoutes ;
