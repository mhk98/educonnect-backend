// const { ENUM_USER_ROLE } = require("../../enums/user");
// const auth = require("../../middlewares/auth");
// const { uploadSingle, uploadPdf } = require("../../middlewares/upload");
// const TaskController = require("./task.controller");
// const router = require("express").Router();

// router.post("/create", uploadPdf,  TaskController.insertIntoDB);
// router.get("/", TaskController.getAllFromDB);
// router.get("/:user_id", TaskController.getAllDataById);
// router.delete("/:id", TaskController.deleteIdFromDB);
// router.put("/:id", TaskController.updateOneFromDB);

// const TaskRoutes = router;
// module.exports =  TaskRoutes ;

const router = require("express").Router();
const { uploadMultiple } = require("../../middlewares/upload");
const TaskController = require("./task.controller");

router.post("/create", uploadMultiple, TaskController.insertIntoDB);

// ✅ overview MUST be before "/:user_id"
router.get("/", TaskController.getAllFromDB);

router.get("/overview", TaskController.getOverview);

router.get("/:user_id", TaskController.getAllDataById);

router.put("/:id", uploadMultiple, TaskController.updateOneFromDB);
router.delete("/:id", TaskController.deleteIdFromDB);

module.exports = router;
