const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadMultiple } = require("../../middlewares/upload");
const EnquiriesController = require("./enquiries.controller");
const router = require("express").Router();

router.post("/create", uploadMultiple, EnquiriesController.insertIntoDB);
router.get("/", EnquiriesController.getAllFromDB);
router.get("/:id", EnquiriesController.getAllDataById);
router.delete("/:id", EnquiriesController.deleteIdFromDB);
router.put("/:id", EnquiriesController.updateOneFromDB);

const EnquiriesRoutes = router;
module.exports =  EnquiriesRoutes ;
