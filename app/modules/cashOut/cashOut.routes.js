const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle } = require("../../middlewares/upload");
const CashOutController = require("./cashOut.controller");
const router = require("express").Router();

router.post("/create",  CashOutController.insertIntoDB);
router.get("/", CashOutController.getAllFromDB);
router.get("/:id", CashOutController.getAllDataById);
router.delete("/:id", CashOutController.deleteIdFromDB);
router.put("/:id", CashOutController.updateOneFromDB);

const CashOutRoutes = router;
module.exports =  CashOutRoutes ;
