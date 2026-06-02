const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle } = require("../../middlewares/upload");
const NoticeController = require("./notice.controller");
const router = require("express").Router();

router.post("/create",  NoticeController.insertIntoDB);
router.get("/", NoticeController.getAllFromDB);
router.get("/:id", NoticeController.getDataById);
router.delete("/:id", NoticeController.deleteIdFromDB);
router.put("/:id", NoticeController.updateOneFromDB);

const NoticeRoutes = router;
module.exports =  NoticeRoutes ;
