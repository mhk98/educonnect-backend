const PixelController = require("./pixel.controller");
const router = require("express").Router();

router.post("/create", PixelController.insertIntoDB);

const PixelRoutes = router;
module.exports = PixelRoutes;
