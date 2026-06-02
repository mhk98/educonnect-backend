const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle, uploadPdf } = require("../../middlewares/upload");
const StudentReplyController = require("./studentReply.controller");
const router = require("express").Router();

router.post("/create", uploadPdf,  StudentReplyController.insertIntoDB);
// router.get("/", StudentReplyController.getAllFromDB);
// router.get("/:id", StudentReplyController.getDataById);
// router.delete("/:id", StudentReplyController.deleteIdFromDB);
// router.put("/:id", StudentReplyController.updateOneFromDB);

const StudentReplyRoutes = router;
module.exports =  StudentReplyRoutes ;
