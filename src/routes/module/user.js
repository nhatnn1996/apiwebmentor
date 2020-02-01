const express = require("express");
const multer = require("multer");
const Route = express.Router();
const passport = require("../config/passport");
const Controller = require("../../controllers/user");
const requireLogin = passport.authenticate("local", { session: false });

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = function(req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

authenRouter.get("user", requireLogin);
authenRouter.post("user", Controller.register);
authenRouter.put("user", requireLogin, Controller.update);
authenRouter.delete("user", requireLogin, Controller.delete);

authenRouter.post("user/login", requireLogin, Controller.login);
authenRouter.post("user/verify", requireLogin, Controller.verify);
authenRouter.post("user/forget", Controller.forget);

Route.post("/update", upload.single("avatar"), Controller.requireInfo);
Route.get("/:id", Controller.read);
Route.get("/", Controller.show);

Route.post("/verify-again", Controller.verify_again);
module.exports = Route;
