const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle } = require("../../middlewares/upload");
const ProgramYearController = require("./programYear.controller");
const router = require("express").Router();

router.post("/create",  ProgramYearController.insertIntoDB);
router.get("/", ProgramYearController.getAllFromDB);
router.get("/:id", ProgramYearController.getDataById);
router.delete("/:id", ProgramYearController.deleteIdFromDB);
router.put("/:id", ProgramYearController.updateOneFromDB);

const ProgramYearRoutes = router;
module.exports =  ProgramYearRoutes ;
