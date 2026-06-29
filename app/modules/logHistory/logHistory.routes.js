const router = require("express").Router();
const auth = require("../../middlewares/auth");
const LogHistoryController = require("./logHistory.controller");

router.get("/", auth(), LogHistoryController.getAllFromDB);

module.exports = router;
