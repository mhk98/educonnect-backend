const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle } = require("../../middlewares/upload");
const ReplyController = require("./reply.controller");
const router = require("express").Router();

router.post("/create",  ReplyController.insertIntoDB);


const ReplyRoutes = router;
module.exports =  ReplyRoutes ;
