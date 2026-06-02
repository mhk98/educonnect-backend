const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle, uploadPdf } = require("../../middlewares/upload");
const CommissionController = require("./commission.controller");
const router = require("express").Router();

router.post("/create",  CommissionController.insertIntoDB);
router.get("/", CommissionController.getAllFromDB);
router.get("/:id", CommissionController.getAllDataById);
router.delete("/:id", CommissionController.deleteIdFromDB);
router.put("/:id", uploadPdf, CommissionController.updateOneFromDB);

const CommissionRoutes = router;
module.exports =  CommissionRoutes ;
