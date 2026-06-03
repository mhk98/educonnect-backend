const router = require("express").Router();
const QuickLinkController = require("./quickLink.controller");

// Public: anyone can read links
router.get("/", QuickLinkController.getAllFromDB);

// Admin/superAdmin only
router.post("/create", QuickLinkController.insertIntoDB);
router.put("/:id", QuickLinkController.updateOneFromDB);
router.delete("/:id", QuickLinkController.deleteIdFromDB);

const QuickLinkRoutes = router;
module.exports = QuickLinkRoutes;
