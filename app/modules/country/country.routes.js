const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle, uploadPdf } = require("../../middlewares/upload");
const CountryController = require("./country.controller");
const router = require("express").Router();

router.post("/create", uploadPdf, CountryController.insertIntoDB);
router.get("/", CountryController.getAllFromDB);
router.get("/:id", CountryController.getAllDataById);
router.delete("/:id", CountryController.deleteIdFromDB);
router.put("/:id", uploadPdf, CountryController.updateOneFromDB);

const CountryRoutes = router;
module.exports = CountryRoutes;
