const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle } = require("../../middlewares/upload");
const ContractController = require("./contract.controller");
const router = require("express").Router();

router.post("/create",  ContractController.insertIntoDB);
router.get("/", ContractController.getAllFromDB);
router.get("/:id", ContractController.getDataById);
router.delete("/:id", ContractController.deleteIdFromDB);
router.put("/:id", ContractController.updateOneFromDB);

const ContractRoutes = router;
module.exports =  ContractRoutes ;
