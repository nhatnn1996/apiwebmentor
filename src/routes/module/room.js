const express = require("express");
const Router = express.Router();
const roomController = require("../../controllers/room");

// mentorRouter.post( "/", MentorController.create )
Router.get("/", roomController.read);
module.exports = Router;
