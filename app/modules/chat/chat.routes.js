const express = require("express");
const auth = require("../../middlewares/auth");
const ChatController = require("./chat.controller");

const router = express.Router();

router.get("/users", auth(), ChatController.getChatUsers);
router.get("/users/:userId/conversation", auth(), ChatController.getConversationByUser);
router.post("/messages", auth(), ChatController.sendMessage);
router.get("/conversations", auth(), ChatController.getConversations);
router.get("/conversations/:conversationId/messages", auth(), ChatController.getMessages);
router.put("/conversations/:conversationId/read", auth(), ChatController.markConversationRead);
router.delete("/messages/:messageId", auth(), ChatController.deleteMessage);
router.put("/messages/:messageId", auth(), ChatController.editMessage);

module.exports = router;
