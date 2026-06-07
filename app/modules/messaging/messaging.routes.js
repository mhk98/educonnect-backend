const express = require("express");
const router = express.Router();
const MessagingController = require("./messaging.controller");
const auth = require("../../middlewares/auth");

// Webhooks (no auth — called by Facebook/WhatsApp servers)
router.get("/webhook/facebook", MessagingController.fbWebhookVerify);
router.post("/webhook/facebook", MessagingController.fbWebhookReceive);
router.get("/webhook/whatsapp", MessagingController.waWebhookVerify);
router.post("/webhook/whatsapp", MessagingController.waWebhookReceive);

// Health check for webhook URL (no auth)
router.get("/webhook/status", (req, res) => {
  res.json({ status: "ok", message: "Webhook endpoint is reachable", ts: new Date().toISOString() });
});

// Protected routes
router.get("/conversations", auth(), MessagingController.getConversations);
router.get("/conversations/:conversationId/messages", auth(), MessagingController.getMessages);
router.post("/conversations/:conversationId/reply", auth(), MessagingController.reply);
router.put("/conversations/:conversationId/read", auth(), MessagingController.markRead);
router.get("/unread", auth(), MessagingController.getUnreadCount);

module.exports = router;
