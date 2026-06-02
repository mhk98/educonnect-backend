const router = require("express").Router();
const controller = require("./taskActivity.controller");

router.get("/:taskId/activity", controller.getTaskActivity);



const TaskActivityRoutes = router;
module.exports =  TaskActivityRoutes ;