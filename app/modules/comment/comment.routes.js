const CommentController = require("./comment.controller");
const router = require("express").Router();

router.post("/create",  CommentController.insertIntoDB);
router.get("/:enquiry_id", CommentController.getDataById);


const CommentRoutes = router;
module.exports =  CommentRoutes ;
