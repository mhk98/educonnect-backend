const { uploadPdf } = require("../../middlewares/upload");
const KCCommentController = require("./kcComment.controller");
const router = require("express").Router();

router.post("/create", uploadPdf,  KCCommentController.insertIntoDB);
router.get("/:application_id", KCCommentController.getDataById);


const KCCommentRoutes = router;
module.exports =  KCCommentRoutes ;
