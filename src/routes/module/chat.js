const express = require("express");
const chatRouter = express.Router();
const ChatController = require("../../controllers/chat");

chatRouter.get("/:room", ChatController.chatInRoom);
module.exports = chatRouter;
