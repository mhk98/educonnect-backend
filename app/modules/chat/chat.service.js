const { Op } = require("sequelize");
const ApiError = require("../../../error/ApiError");
const paginationHelpers = require("../../../helpers/paginationHelper");
const db = require("../../../models");
const { emitToUser } = require("../realtime/socket");

const ChatConversation = db.chatConversation;
const ChatMessage = db.chatMessage;
const Notification = db.notification;
const User = db.user;

const CHAT_ALLOWED_ROLES = ["employee", "admin", "superAdmin"];

const USER_PUBLIC_ATTRIBUTES = [
  "id",
  "FirstName",
  "LastName",
  "Email",
  "image",
  "Role",
  "Branch",
  "Status",
];

const assertChatUser = (actor = {}) => {
  if (!actor?.id) throw new ApiError(401, "You are not authorized");
  if (!CHAT_ALLOWED_ROLES.includes(actor.Role)) {
    throw new ApiError(403, "Chat is not allowed for this role");
  }
};

const getActorFromDB = async (reqUser) => {
  const user = await User.findOne({ where: { id: reqUser.id } });
  if (!user) throw new ApiError(401, "User not found");
  return user.get({ plain: true });
};

const getDisplayName = (user = {}) =>
  `${user.FirstName || ""} ${user.LastName || ""}`.trim() ||
  user.Email ||
  `User ${user.id || ""}`;

const sanitizeMessage = (value) => {
  const message = String(value || "").trim();
  if (!message) throw new ApiError(400, "Message is required");
  if (message.length > 5000)
    throw new ApiError(400, "Message cannot be longer than 5000 characters");
  return message;
};

const getParticipantWhere = (userId) => ({
  [Op.or]: [{ userOneId: userId }, { userTwoId: userId }],
});

const getPairIds = (aId, bId) => {
  const ids = [String(aId), String(bId)].sort();
  if (ids[0] === ids[1]) throw new ApiError(400, "Cannot send message to yourself");
  return { userOneId: ids[0], userTwoId: ids[1] };
};

const ensureConversationAccess = async (conversationId, actorId) => {
  const id = Number(conversationId);
  if (!Number.isFinite(id)) throw new ApiError(400, "Invalid conversation id");
  const conversation = await ChatConversation.findOne({
    where: { id, ...getParticipantWhere(actorId) },
  });
  if (!conversation) throw new ApiError(404, "Conversation not found");
  return conversation;
};

const getChatUsers = async (filters = {}, options = {}, reqUser) => {
  const actor = await getActorFromDB(reqUser);
  assertChatUser(actor);
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm } = filters;

  const andConditions = [
    { id: { [Op.ne]: actor.id } },
    { Role: { [Op.in]: CHAT_ALLOWED_ROLES } },
  ];

  // Branch filtering: admin/employee see own branch + superAdmins
  if (actor.Role !== "superAdmin" && actor.Branch) {
    andConditions.push({
      [Op.or]: [{ Branch: actor.Branch }, { Role: "superAdmin" }],
    });
  }

  if (searchTerm && String(searchTerm).trim()) {
    const term = String(searchTerm).trim();
    andConditions.push({
      [Op.or]: ["FirstName", "LastName", "Email"].map((field) => ({
        [field]: { [Op.like]: `%${term}%` },
      })),
    });
  }

  const whereConditions = { [Op.and]: andConditions };
  const data = await User.findAll({
    where: whereConditions,
    attributes: USER_PUBLIC_ATTRIBUTES,
    offset: skip,
    limit,
    order: [["FirstName", "ASC"], ["LastName", "ASC"]],
  });
  const count = await User.count({ where: whereConditions });

  return { meta: { count, page, limit }, data };
};

const getConversationByUser = async (otherUserId, reqUser) => {
  const actor = await getActorFromDB(reqUser);
  assertChatUser(actor);
  const pair = getPairIds(actor.id, otherUserId);

  const conversation = await ChatConversation.findOne({
    where: pair,
    include: [
      { model: ChatMessage, as: "lastMessage" },
      { model: User, as: "userOne", attributes: USER_PUBLIC_ATTRIBUTES },
      { model: User, as: "userTwo", attributes: USER_PUBLIC_ATTRIBUTES },
    ],
  });
  return conversation;
};

const sendMessage = async (payload = {}, reqUser) => {
  const actor = await getActorFromDB(reqUser);
  assertChatUser(actor);

  const receiverUserId = String(payload.receiverUserId || "");
  const message = sanitizeMessage(payload.message);
  const messageType = String(payload.messageType || "text").trim() || "text";

  const receiver = await User.findOne({
    where: { id: receiverUserId, Role: { [Op.in]: CHAT_ALLOWED_ROLES } },
    attributes: USER_PUBLIC_ATTRIBUTES,
  });
  if (!receiver) throw new ApiError(404, "Receiver not found or chat not allowed");

  const pair = getPairIds(actor.id, receiverUserId);
  const [conversation] = await ChatConversation.findOrCreate({
    where: pair,
    defaults: pair,
  });

  const chatMessage = await ChatMessage.create({
    conversationId: conversation.id,
    senderUserId: actor.id,
    receiverUserId,
    message,
    messageType,
  });

  await ChatConversation.update(
    { lastMessageId: chatMessage.id, lastMessageAt: chatMessage.createdAt },
    { where: { id: conversation.id } },
  );

  const result = await ChatMessage.findOne({
    where: { id: chatMessage.id },
    include: [
      { model: User, as: "sender", attributes: USER_PUBLIC_ATTRIBUTES },
      { model: User, as: "receiver", attributes: USER_PUBLIC_ATTRIBUTES },
    ],
  });

  const eventPayload = { conversationId: conversation.id, message: result };
  emitToUser(actor.id, "chat:message:new", eventPayload);
  emitToUser(receiverUserId, "chat:message:new", eventPayload);

  await Notification.create({
    userId: receiverUserId,
    message: `New message from ${getDisplayName(actor)}`,
    url: `/app/chat`,
    isRead: false,
  });

  return eventPayload;
};

const getConversations = async (options = {}, reqUser) => {
  const actor = await getActorFromDB(reqUser);
  assertChatUser(actor);
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const whereConditions = getParticipantWhere(actor.id);

  const rows = await ChatConversation.findAll({
    where: whereConditions,
    include: [
      { model: ChatMessage, as: "lastMessage" },
      { model: User, as: "userOne", attributes: USER_PUBLIC_ATTRIBUTES },
      { model: User, as: "userTwo", attributes: USER_PUBLIC_ATTRIBUTES },
    ],
    offset: skip,
    limit,
    order: [["lastMessageAt", "DESC"], ["updatedAt", "DESC"]],
  });

  const count = await ChatConversation.count({ where: whereConditions });

  const data = await Promise.all(
    rows.map(async (row) => {
      const plain = row.get({ plain: true });
      const otherUser =
        plain.userOneId === actor.id ? plain.userTwo : plain.userOne;
      const unreadCount = await ChatMessage.count({
        where: {
          conversationId: plain.id,
          receiverUserId: actor.id,
          isRead: false,
        },
      });
      return { ...plain, otherUser, unreadCount };
    }),
  );

  return { meta: { count, page, limit }, data };
};

const getMessages = async (conversationId, options = {}, reqUser) => {
  const actor = await getActorFromDB(reqUser);
  assertChatUser(actor);
  const conversation = await ensureConversationAccess(conversationId, actor.id);
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  const rows = await ChatMessage.findAll({
    where: { conversationId: conversation.id },
    include: [
      { model: User, as: "sender", attributes: USER_PUBLIC_ATTRIBUTES },
      { model: User, as: "receiver", attributes: USER_PUBLIC_ATTRIBUTES },
    ],
    offset: skip,
    limit,
    order: [["createdAt", "DESC"]],
  });

  const count = await ChatMessage.count({ where: { conversationId: conversation.id } });

  const plain = conversation.get({ plain: true });
  const otherUserId =
    plain.userOneId === actor.id ? plain.userTwoId : plain.userOneId;
  const otherUser = await User.findOne({
    where: { id: otherUserId },
    attributes: USER_PUBLIC_ATTRIBUTES,
  });

  return {
    meta: { count, page, limit },
    messages: rows.reverse(),
    conversation,
    otherUser,
  };
};

const markConversationRead = async (conversationId, reqUser) => {
  const actor = await getActorFromDB(reqUser);
  assertChatUser(actor);
  const conversation = await ensureConversationAccess(conversationId, actor.id);
  const readAt = new Date();

  const [updatedCount] = await ChatMessage.update(
    { isRead: true, readAt },
    { where: { conversationId: conversation.id, receiverUserId: actor.id, isRead: false } },
  );

  const plain = conversation.get({ plain: true });
  const otherUserId =
    plain.userOneId === actor.id ? plain.userTwoId : plain.userOneId;

  const eventPayload = {
    conversationId: conversation.id,
    readerUserId: actor.id,
    readAt,
    updatedCount,
  };

  emitToUser(otherUserId, "chat:messages:read", eventPayload);
  emitToUser(actor.id, "chat:messages:read", eventPayload);

  return eventPayload;
};

const deleteMessage = async (messageId, reqUser) => {
  const actor = await getActorFromDB(reqUser);
  assertChatUser(actor);

  const message = await ChatMessage.findOne({
    where: { id: Number(messageId), senderUserId: actor.id },
  });
  if (!message) throw new ApiError(404, "Message not found");

  await message.destroy();

  emitToUser(message.receiverUserId, "chat:message:deleted", {
    conversationId: message.conversationId,
    messageId: message.id,
  });
  emitToUser(actor.id, "chat:message:deleted", {
    conversationId: message.conversationId,
    messageId: message.id,
  });

  return { deleted: true, messageId: message.id };
};

const editMessage = async (messageId, newText, reqUser) => {
  const actor = await getActorFromDB(reqUser);
  assertChatUser(actor);

  const text = sanitizeMessage(newText);
  const message = await ChatMessage.findOne({
    where: { id: Number(messageId), senderUserId: actor.id },
  });
  if (!message) throw new ApiError(404, "Message not found");

  await message.update({ message: text });

  const result = await ChatMessage.findOne({
    where: { id: message.id },
    include: [
      { model: User, as: "sender", attributes: USER_PUBLIC_ATTRIBUTES },
      { model: User, as: "receiver", attributes: USER_PUBLIC_ATTRIBUTES },
    ],
  });

  const payload = { conversationId: message.conversationId, message: result };
  emitToUser(message.receiverUserId, "chat:message:edited", payload);
  emitToUser(actor.id, "chat:message:edited", payload);

  return payload;
};

module.exports = {
  getChatUsers,
  getConversationByUser,
  sendMessage,
  getConversations,
  getMessages,
  markConversationRead,
  deleteMessage,
  editMessage,
};
