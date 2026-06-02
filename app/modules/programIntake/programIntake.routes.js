const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle } = require("../../middlewares/upload");
const ProgramIntakeController = require("./programIntake.controller");
const router = require("express").Router();

router.post("/create",  ProgramIntakeController.insertIntoDB);
router.get("/", ProgramIntakeController.getAllFromDB);
router.get("/:id", ProgramIntakeController.getDataById);
router.delete("/:id", ProgramIntakeController.deleteIdFromDB);
router.put("/:id", ProgramIntakeController.updateOneFromDB);

const ProgramIntakeRoutes = router;
module.exports =  ProgramIntakeRoutes;
