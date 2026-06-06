const MessagingService = require("./messaging.service");
const db = require("../../../models");
const catchAsync = require("../../../shared/catchAsync");

const getActorFromDB = async (reqUser) => {
  const user = await db.user.findOne({ where: { id: reqUser.id } });
  if (!user) throw new Error("User not found");
  return user;
};

const fbWebhookVerify = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === process.env.FB_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
};

const fbWebhookReceive = catchAsync(async (req, res) => {
  if (req.body.object === "page") {
    await MessagingService.handleFacebookWebhook(req.body);
  }
  res.sendStatus(200);
});

const waWebhookVerify = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === process.env.WA_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
};

const waWebhookReceive = catchAsync(async (req, res) => {
  if (req.body.object === "whatsapp_business_account") {
    await MessagingService.handleWhatsAppWebhook(req.body);
  }
  res.sendStatus(200);
});

const getConversations = catchAsync(async (req, res) => {
  const conversations = await MessagingService.getConversations();
  res.json({ success: true, data: conversations });
});

const getMessages = catchAsync(async (req, res) => {
  const result = await MessagingService.getMessages(req.params.conversationId);
  res.json({ success: true, data: result });
});

const reply = catchAsync(async (req, res) => {
  const actor = await getActorFromDB(req.user);
  const msg = await MessagingService.replyToConversation(
    req.params.conversationId,
    req.body.message,
    actor,
  );
  res.json({ success: true, data: msg });
});

const markRead = catchAsync(async (req, res) => {
  await MessagingService.markRead(req.params.conversationId);
  res.json({ success: true });
});

const getUnreadCount = catchAsync(async (req, res) => {
  const count = await MessagingService.getTotalUnread();
  res.json({ success: true, data: { count } });
});

module.exports = {
  fbWebhookVerify,
  fbWebhookReceive,
  waWebhookVerify,
  waWebhookReceive,
  getConversations,
  getMessages,
  reply,
  markRead,
  getUnreadCount,
};
