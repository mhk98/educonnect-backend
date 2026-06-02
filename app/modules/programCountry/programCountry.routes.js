const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle } = require("../../middlewares/upload");
const ProgramCountryController = require("./programCountry.controller");
const router = require("express").Router();

router.post("/create",  ProgramCountryController.insertIntoDB);
router.get("/", ProgramCountryController.getAllFromDB);
router.get("/:id", ProgramCountryController.getDataById);
router.delete("/:id", ProgramCountryController.deleteIdFromDB);
router.put("/:id", ProgramCountryController.updateOneFromDB);

const ProgramCountryRoutes = router;
module.exports =  ProgramCountryRoutes ;
