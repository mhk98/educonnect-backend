const axios = require("axios");
const { Op } = require("sequelize");
const db = require("../../../models");
const ApiError = require("../../../error/ApiError");
const { emitToUser } = require("../realtime/socket");
const { sendMail } = require("../../../helpers/mailer");

const Conversation = db.externalConversation;
const Message = db.externalMessage;
const User = db.user;

/* ─── helpers ─── */
const getOrCreateConversation = async (platform, externalId, senderName) => {
  const [conv] = await Conversation.findOrCreate({
    where: { platform, externalId },
    defaults: { platform, externalId, senderName, unreadCount: 0 },
  });
  if (senderName && conv.senderName !== senderName) {
    await conv.update({ senderName });
  }
  return conv;
};

const notifyStaff = async (platform, senderName, messageText) => {
  // Socket: emit to all connected users (they filter on frontend)
  emitToUser("__broadcast__", "messaging:new", { platform, senderName, messageText });

  // Email: send to all admin/superAdmin
  if (!process.env.SMTP_HOST) return;
  try {
    const staffUsers = await User.findAll({
      where: { Role: { [Op.in]: ["admin", "superAdmin"] } },
      attributes: ["Email"],
    });
    const emails = staffUsers.map((u) => u.Email).filter(Boolean);
    if (!emails.length) return;

    const platformLabel = platform === "facebook" ? "Facebook" : "WhatsApp";
    await sendMail({
      to: emails,
      subject: `নতুন ${platformLabel} message — ${senderName}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto">
          <h2 style="color:#1B2E6B">EduConnect — নতুন Message</h2>
          <p><strong>Platform:</strong> ${platformLabel}</p>
          <p><strong>Sender:</strong> ${senderName}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left:3px solid #1B2E6B;padding:8px 16px;color:#334155">${messageText}</blockquote>
          <a href="${process.env.APP_URL || "http://localhost:3000"}/app/messaging"
             style="display:inline-block;margin-top:12px;padding:10px 20px;background:#1B2E6B;color:#fff;border-radius:8px;text-decoration:none">
            Reply করুন
          </a>
        </div>
      `,
    });
  } catch (err) {
    console.error("Email notification failed:", err.message);
  }
};

/* ─── Facebook webhook handler ─── */
const handleFacebookWebhook = async (body) => {
  const entries = body?.entry || [];
  for (const entry of entries) {
    for (const event of entry.messaging || []) {
      const senderId = event.sender?.id;
      const messageText = event.message?.text;
      if (!senderId || !messageText || event.message?.is_echo) continue;

      // Get sender name via Graph API (best-effort)
      let senderName = `FB User ${senderId.slice(-4)}`;
      try {
        if (process.env.FB_PAGE_ACCESS_TOKEN) {
          const { data } = await axios.get(
            `https://graph.facebook.com/${senderId}`,
            { params: { fields: "first_name,last_name", access_token: process.env.FB_PAGE_ACCESS_TOKEN } },
          );
          senderName = `${data.first_name || ""} ${data.last_name || ""}`.trim() || senderName;
        }
      } catch { /* ignore */ }

      const conv = await getOrCreateConversation("facebook", senderId, senderName);
      await Message.create({
        conversationId: conv.id,
        platform: "facebook",
        externalId: senderId,
        senderName,
        message: messageText,
        direction: "incoming",
        platformMessageId: event.message?.mid,
      });
      await conv.update({
        lastMessage: messageText,
        lastMessageAt: new Date(),
        unreadCount: (conv.unreadCount || 0) + 1,
      });

      await notifyStaff("facebook", senderName, messageText);
    }
  }
};

/* ─── WhatsApp webhook handler ─── */
const handleWhatsAppWebhook = async (body) => {
  const entries = body?.entry || [];
  const changes = entries.flatMap((e) => e.changes || []);

  console.log("[WA] entries:", entries.length, "changes:", changes.length);

  for (const change of changes) {
    const messages = change.value?.messages || [];
    const contacts = change.value?.contacts || [];

    console.log("[WA] messages in change:", messages.length);

    for (const msg of messages) {
      console.log("[WA] msg type:", msg.type, "from:", msg.from);
      if (msg.type !== "text") {
        console.log("[WA] Skipping non-text message type:", msg.type);
        continue;
      }
      const phone = msg.from;
      const messageText = msg.text?.body;
      if (!phone || !messageText) continue;

      const contact = contacts.find((c) => c.wa_id === phone);
      const senderName = contact?.profile?.name || `+${phone}`;

      const conv = await getOrCreateConversation("whatsapp", phone, senderName);
      await Message.create({
        conversationId: conv.id,
        platform: "whatsapp",
        externalId: phone,
        senderName,
        message: messageText,
        direction: "incoming",
        platformMessageId: msg.id,
      });
      await conv.update({
        lastMessage: messageText,
        lastMessageAt: new Date(),
        unreadCount: (conv.unreadCount || 0) + 1,
      });

      await notifyStaff("whatsapp", senderName, messageText);
    }
  }
};

/* ─── Reply ─── */
const replyToConversation = async (conversationId, replyText, actor) => {
  const conv = await Conversation.findByPk(conversationId);
  if (!conv) throw new ApiError(404, "Conversation not found");

  const replierName = `${actor.FirstName || ""} ${actor.LastName || ""}`.trim() || actor.Email;

  if (conv.platform === "facebook") {
    if (!process.env.FB_PAGE_ACCESS_TOKEN) throw new ApiError(503, "Facebook API not configured yet");
    await axios.post(
      `https://graph.facebook.com/v19.0/me/messages`,
      { recipient: { id: conv.externalId }, message: { text: replyText } },
      { params: { access_token: process.env.FB_PAGE_ACCESS_TOKEN } },
    );
  } else if (conv.platform === "whatsapp") {
    if (!process.env.WA_ACCESS_TOKEN || !process.env.WA_PHONE_NUMBER_ID)
      throw new ApiError(503, "WhatsApp API not configured yet");
    await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.WA_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: conv.externalId,
        type: "text",
        text: { body: replyText },
      },
      { headers: { Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}` } },
    );
  }

  const msg = await Message.create({
    conversationId: conv.id,
    platform: conv.platform,
    externalId: conv.externalId,
    senderName: replierName,
    message: replyText,
    direction: "outgoing",
    repliedByName: replierName,
  });
  await conv.update({ lastMessage: replyText, lastMessageAt: new Date() });

  return msg;
};

/* ─── Queries ─── */
const getConversations = async () => {
  return Conversation.findAll({ order: [["lastMessageAt", "DESC"], ["updatedAt", "DESC"]] });
};

const getMessages = async (conversationId) => {
  const conv = await Conversation.findByPk(conversationId);
  if (!conv) throw new ApiError(404, "Conversation not found");
  const messages = await Message.findAll({
    where: { conversationId },
    order: [["createdAt", "ASC"]],
  });
  return { conversation: conv, messages };
};

const markRead = async (conversationId) => {
  const conv = await Conversation.findByPk(conversationId);
  if (conv) await conv.update({ unreadCount: 0 });
};

const getTotalUnread = async () => {
  const result = await Conversation.sum("unreadCount");
  return result || 0;
};

module.exports = {
  handleFacebookWebhook,
  handleWhatsAppWebhook,
  replyToConversation,
  getConversations,
  getMessages,
  markRead,
  getTotalUnread,
};
