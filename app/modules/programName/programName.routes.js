const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle } = require("../../middlewares/upload");
const ProgramNameController = require("./programName.controller");
const router = require("express").Router();

router.post("/create",  ProgramNameController.insertIntoDB);
router.get("/", ProgramNameController.getAllFromDB);
router.get("/:id", ProgramNameController.getDataById);
router.delete("/:id", ProgramNameController.deleteIdFromDB);
router.put("/:id", ProgramNameController.updateOneFromDB);

const ProgramNameRoutes = router;
module.exports =  ProgramNameRoutes ;
