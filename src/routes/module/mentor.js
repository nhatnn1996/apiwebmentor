const express = require("express");
const mentorRouter = express.Router();
const MentorController = require("../../controllers/mentor");
const upload = require("../../config/multer");

mentorRouter.post("/", upload.single("avatar"), MentorController.created);
mentorRouter.get("/", MentorController.getme);
mentorRouter.get("/:id", MentorController.read);

module.exports = mentorRouter;
