const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { seventhUpload } = require("../../middlewares/upload");
const DocumentController = require("./document.controller");
const router = require("express").Router();

router.post("/create",  DocumentController.insertIntoDB);
router.get("/", DocumentController.getAllFromDB);
router.get("/:id", DocumentController.getDataById);
router.delete("/:id", DocumentController.deleteIdFromDB);
router.put("/:id", seventhUpload, DocumentController.updateOneFromDB);

const DocumentRoutes = router;
module.exports =  DocumentRoutes ;
