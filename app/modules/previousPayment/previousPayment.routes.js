const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle } = require("../../middlewares/upload");
const PreviousPaymentController = require("./previousPayment.controller");
const router = require("express").Router();

router.post("/create",  PreviousPaymentController.insertIntoDB);
router.get("/", PreviousPaymentController.getAllFromDB);
router.get("/:id", PreviousPaymentController.getAllDataById);
router.delete("/:id", PreviousPaymentController.deleteIdFromDB);
router.put("/:id", PreviousPaymentController.updateOneFromDB);

const PreviousPaymentRoutes = router;
module.exports =  PreviousPaymentRoutes ;
