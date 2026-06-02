const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle } = require("../../middlewares/upload");
const AcademicController = require("./academic.controller");
const router = require("express").Router();

router.post("/create",  AcademicController.insertIntoDB);
router.get("/", AcademicController.getAllFromDB);
router.get("/:id", AcademicController.getDataById);
router.delete("/:id", AcademicController.deleteIdFromDB);
router.put("/:id", AcademicController.updateOneFromDB);

const AcademicRoutes = router;
module.exports =  AcademicRoutes ;
