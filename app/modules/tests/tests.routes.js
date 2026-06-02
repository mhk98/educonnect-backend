const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle } = require("../../middlewares/upload");
const TestsController = require("./tests.controller");
const router = require("express").Router();

router.post("/create",  TestsController.insertIntoDB);
router.get("/", TestsController.getAllFromDB);
router.get("/:id", TestsController.getDataById);
router.delete("/:id", TestsController.deleteIdFromDB);
router.put("/:id", TestsController.updateOneFromDB);

const TestsRoutes = router;
module.exports =  TestsRoutes ;
