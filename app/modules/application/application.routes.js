const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle } = require("../../middlewares/upload");
const ApplicationController = require("./application.controller");
const router = require("express").Router();

router.post("/create",  ApplicationController.insertIntoDB);
router.get("/", ApplicationController.getAllFromDB);
router.get("/status", ApplicationController.getAllApplications);
router.get("/:id", ApplicationController.getAllDataById);
router.delete("/:acknowledge", ApplicationController.deleteIdFromDB);
router.put("/:id", ApplicationController.updateOneFromDB);

const ApplicationRoutes = router;
module.exports =  ApplicationRoutes ;
