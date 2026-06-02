const { uploadPdf } = require("../../middlewares/upload");
const StudentCommentController = require("./studentComment.controller");
const router = require("express").Router();

router.post("/create", uploadPdf,  StudentCommentController.insertIntoDB);
router.get("/:application_id", StudentCommentController.getDataById);


const StudentCommentRoutes = router;
module.exports =  StudentCommentRoutes ;
