const AuthController = require("../controllers/authentication");
const express = require("express");
const passport = require("../config/passport");

const MentorRouter = require("./module/mentor");
const SpecializedRouter = require("./module/specialized");
const RentRoute = require("./module/contract");
const userRoutes = require("./module/user");
const globalRouter = require("./module/global");
const chatRouter = require("./module/chat");
const roomRouter = require("./module/room");

// Middleware for login/auth
const requireAuth = passport.authenticate("jwt", { session: true });
const requireLogin = passport.authenticate("local", { session: false });

module.exports = function(app) {
  const apiRoutes = express.Router();
  const authenRouter = express.Router();

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  // user

  //authenRouter.put("user/:usename");
  //authenRouter.delete("user/:usename");

  //   authenRouter.post("/google", AuthController.loginByGoogle);
  authenRouter.post("/forget-password", AuthController.forget_password);
  authenRouter.post("/reset-password", AuthController.reset_password);

  apiRoutes.use("/auth", authenRouter);
  apiRoutes.use("/global", authenRouter, globalRouter);
  apiRoutes.use("/mentor", requireAuth, MentorRouter);
  apiRoutes.use("/specialized", requireAuth, SpecializedRouter);

  apiRoutes.use("/user", requireAuth, userRoutes);
  apiRoutes.use("/contract", requireAuth, RentRoute);
  apiRoutes.use("/chat", requireAuth, chatRouter);
  apiRoutes.use("/room", requireAuth, roomRouter);

  app.use("/api", apiRoutes);
};
