const PaymentController = require("./payment.controller");
const router = require("express").Router();

router.post("/init", PaymentController.initPayment);
router.post("/webhook", PaymentController.webhook);


const PaymentRoutes = router;
module.exports =  PaymentRoutes ;
