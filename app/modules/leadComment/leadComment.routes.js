const { uploadPdf } = require("../../middlewares/upload");
const LeadCommentController = require("./leadComment.controller");
const router = require("express").Router();

router.post("/create", uploadPdf,  LeadCommentController.insertIntoDB);
router.get("/:lead_id", LeadCommentController.getDataById);


const LeadCommentRoutes = router;
module.exports =  LeadCommentRoutes ;
