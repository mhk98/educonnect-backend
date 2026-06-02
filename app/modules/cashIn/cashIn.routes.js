const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle } = require("../../middlewares/upload");
const CashInController = require("./cashIn.controller");
const router = require("express").Router();

router.post("/create",  CashInController.insertIntoDB);
router.get("/", CashInController.getAllFromDB);
router.get("/:id", CashInController.getAllDataById);
router.delete("/:id", CashInController.deleteIdFromDB);
router.put("/:id", CashInController.updateOneFromDB);

const CashInRoutes = router;
module.exports =  CashInRoutes ;
