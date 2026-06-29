const router = require("express").Router();
const controller = require("./taskActivity.controller");
const auth = require("../../middlewares/auth");

router.get("/", auth(), controller.getAllTaskActivity);
router.get("/all", auth(), controller.getAllTaskActivity);
router.get("/:taskId/activity", controller.getTaskActivity);



const TaskActivityRoutes = router;
module.exports =  TaskActivityRoutes ;
