const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle, uploadPdf } = require("../../middlewares/upload");
const KCReplyController = require("./kcReply.controller");
const router = require("express").Router();

router.post("/create", uploadPdf,  KCReplyController.insertIntoDB);


const KCReplyRoutes = router;
module.exports =  KCReplyRoutes ;
