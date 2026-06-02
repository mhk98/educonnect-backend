const { uploadPdf } = require("../../middlewares/upload");
const PendingPaymentController = require("./pendingPayment.controller");
const router = require("express").Router();

router.post("/init", uploadPdf, PendingPaymentController.initPayment);
router.post("/webhook", PendingPaymentController.webhook);
router.get("/all", PendingPaymentController.getAllFromDBWithoutQuery);
router.get("/:id", PendingPaymentController.getAllDataById);
router.get("/", PendingPaymentController.getAllData);
router.put("/:id", PendingPaymentController.updateOneFromDB);
router.delete("/:id", PendingPaymentController.deleteIdFromDB);

const PendingPaymentRoutes = router;
module.exports = PendingPaymentRoutes;
