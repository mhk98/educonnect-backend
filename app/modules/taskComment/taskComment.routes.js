const router = require("express").Router();
const controller = require("./taskComment.controller");

router.post("/:taskId/comment", controller.addComment);
router.get("/:taskId/comment", controller.getComments);
router.put("/comment/:id", controller.editComment);
router.delete("/comment/:id", controller.deleteComment);

module.exports = router;

// Export the router
const TaskCommentRoutes = router;
module.exports = TaskCommentRoutes;
