const { ENUM_USER_ROLE } = require("../../enums/user");
const auth = require("../../middlewares/auth");
const { uploadSingle, uploadPdf } = require("../../middlewares/upload");
const BranchController = require("./branch.controller");
const router = require("express").Router();

router.post("/create", uploadPdf, BranchController.insertIntoDB);
router.get("/", BranchController.getAllFromDB);
router.get("/:id", BranchController.getAllDataById);
router.delete("/:id", BranchController.deleteIdFromDB);
router.put("/:id", uploadPdf, BranchController.updateOneFromDB);

const BranchRoutes = router;
module.exports = BranchRoutes;
