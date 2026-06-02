const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle } = require("../../middlewares/upload");
const ProgramUniversityController = require("./programUniversity.controller");
const router = require("express").Router();

router.post("/create",  ProgramUniversityController.insertIntoDB);
router.get("/", ProgramUniversityController.getAllFromDB);
router.get("/:id", ProgramUniversityController.getDataById);
router.delete("/:id", ProgramUniversityController.deleteIdFromDB);
router.put("/:id", ProgramUniversityController.updateOneFromDB);

const ProgramUniversityRoutes = router;
module.exports =  ProgramUniversityRoutes ;
