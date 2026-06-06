const catchAsync = require("../../../shared/catchAsync");
const pick = require("../../../shared/pick");
const sendResponse = require("../../../shared/sendResponse");
const ChatService = require("./chat.service");

const getChatUsers = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["searchTerm"]);
  const options = pick(req.query, ["limit", "page"]);
  const result = await ChatService.getChatUsers(filters, options, req.user);
  sendResponse(res, { statusCode: 200, success: true, message: "Chat users fetched", data: result });
});

const getConversationByUser = catchAsync(async (req, res) => {
  const result = await ChatService.getConversationByUser(req.params.userId, req.user);
  sendResponse(res, { statusCode: 200, success: true, message: "Conversation fetched", data: result });
});

const sendMessage = catchAsync(async (req, res) => {
  const result = await ChatService.sendMessage(req.body, req.user);
  sendResponse(res, { statusCode: 200, success: true, message: "Message sent", data: result });
});

const getConversations = catchAsync(async (req, res) => {
  const options = pick(req.query, ["limit", "page"]);
  const result = await ChatService.getConversations(options, req.user);
  sendResponse(res, { statusCode: 200, success: true, message: "Conversations fetched", data: result });
});

const getMessages = catchAsync(async (req, res) => {
  const options = pick(req.query, ["limit", "page"]);
  const result = await ChatService.getMessages(req.params.conversationId, options, req.user);
  sendResponse(res, { statusCode: 200, success: true, message: "Messages fetched", data: result });
});

const markConversationRead = catchAsync(async (req, res) => {
  const result = await ChatService.markConversationRead(req.params.conversationId, req.user);
  sendResponse(res, { statusCode: 200, success: true, message: "Marked as read", data: result });
});

const deleteMessage = catchAsync(async (req, res) => {
  const result = await ChatService.deleteMessage(req.params.messageId, req.user);
  sendResponse(res, { statusCode: 200, success: true, message: "Message deleted", data: result });
});

const editMessage = catchAsync(async (req, res) => {
  const result = await ChatService.editMessage(req.params.messageId, req.body.message, req.user);
  sendResponse(res, { statusCode: 200, success: true, message: "Message updated", data: result });
});

const ChatController = {
  getChatUsers,
  getConversationByUser,
  sendMessage,
  getConversations,
  getMessages,
  markConversationRead,
  deleteMessage,
  editMessage,
};

module.exports = ChatController;
