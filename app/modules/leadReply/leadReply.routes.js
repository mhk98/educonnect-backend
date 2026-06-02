const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle, uploadPdf } = require("../../middlewares/upload");
const LeadReplyController = require("./leadReply.controller");
const router = require("express").Router();

router.post("/create", uploadPdf,  LeadReplyController.insertIntoDB);
// router.get("/", LeadReplyController.getAllFromDB);
// router.get("/:id", LeadReplyController.getDataById);
// router.delete("/:id", LeadReplyController.deleteIdFromDB);
// router.put("/:id", LeadReplyController.updateOneFromDB);

const LeadReplyRoutes = router;
module.exports =  LeadReplyRoutes ;
