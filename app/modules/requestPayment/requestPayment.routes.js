const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle } = require("../../middlewares/upload");
const RequestPaymentController = require("./requestPayment.controller");
const router = require("express").Router();

router.post("/create",  RequestPaymentController.insertIntoDB);
router.get("/", RequestPaymentController.getAllFromDB);
router.get("/:id", RequestPaymentController.getAllDataById);
router.delete("/:id", RequestPaymentController.deleteIdFromDB);
router.put("/:id", RequestPaymentController.updateOneFromDB);

const RequestPaymentRoutes = router;
module.exports =  RequestPaymentRoutes ;
