"use strict";
const bearer = require("jsonwebtoken");
const User = require("../models/user");
const Mentor = require("../models/mentor");
const config = require("../config/main");
const { resError, resData } = require("../helper/response");
const sendMail = require("../service/sendMail");

const Rule = require("../helper/rule");
// Tạo ra đoạn json token
function generateToken(user) {
  return bearer.sign(user, config.secret, {
    expiresIn: "100h"
  });
}
// convert thông tin user từ req sanng object user
function Info(user) {
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    scores: user.scores
  };
}
// LOGIN ROUTE
exports.login = function(req, res, next) {
  User.findOne({ _id: req.user._id })
    .populate("specialized")
    .populate("semester")
    .exec(async function(err, result) {
      const mentor = await Mentor.findOne({ user: result._id });
      const data = {
        ...Rule.user(result),
        mentor: Rule.mentor(mentor)
      };
      res.status(200).json({
        token:
          "JWT " + generateToken({ _id: req.user._id, email: req.user.email }),
        data: data,
        code: 200,
        message: "login success"
      });
    });
};

exports.profile = function(req, res, next) {
  User.findOne({ _id: req.user._id })
    .populate("specialized")
    .populate("semester")
    .exec(function(err, result) {
      if (err) return res.status(400).send("bad request");
      else return res.status(200).json(Info(result));
    });
};

// REGISTRATION ROUTE
exports.register = function(req, res, next) {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(200).json({
      code: "SYS00032",
      message: "Required full field to register"
    });
  }
  // Looks for existing username and makes user account if no duplicate are found
  User.findOne({ email }, function(err, result) {
    if (err) {
      return next(err);
    }
    if (result) {
      return resError(422, "Email đã được đăng ký", res);
    } else {
      const verify = Math.floor(Math.random() * 99999999999) + 100000000;
      let user = new User({
        email: email,
        password: password,
        name: name,
        verify: verify,
        surplus: 1000,
        scores: 100
      });
      sendMail(user.email, verify, name);
      user.save(function(err, user) {
        res.status(200).json({
          code: 200,
          message: "Account is create",
          data: Rule.user(user)
        });
      });
    }
  });
};

exports.loginByGoogle = async (req, res) => {
  const { name, email, image, type, id } = req.body;
  const password = email + id;
  const social = [{ type, id }];
  User.findOne({ email }, async (err, result) => {
    let user = null;
    if (result === null) {
      user = await User.create({
        name,
        email,
        active: true,
        password,
        social,
        surplus: 1000,
        scores: 100
      });
    } else {
      user = result;
    }

    const usertoken = {
      _id: user._id,
      email: user.email
    };
    const data = {
      token: "JWT " + generateToken(usertoken),
      user: Rule.user(user)
    };
    return res.status(200).json(data);
  });
};

exports.verify = async (req, res) => {
  const { code, id } = req.body;

  if (!code || !id) {
    return res.status(200).json({
      status: 400,
      message: "Required code and id user"
    });
  } else {
    const user = await User.findById(id);
    if (user && code === user.verify) {
      User.updateOne({ _id: id }, { active: true }, (err, result) => {
        if (result)
          return res.status(200).json({
            code: 200,
            messsage: "User is actived",
            data: Rule.user(user),
            token:
              "JWT " +
              generateToken({
                _id: user._id,
                email: user.email
              })
          });
      });
    } else {
      return res.status(200).json({
        code: 400,
        messsage: "Code is invalid",
        data: null
      });
    }
  }
};

exports.verify_again = async (req, res) => {
  console.log("run");
  const id = req.user._id;
  const verify = Math.floor(Math.random() * 99999999999) + 100000000;
  User.updateOne({ _id: id }, { verify });
  const user = await User.findById(id);
  sendMail(user.email, verify, user.name);
  res.status(200).json({
    code: 200,
    message: "send message success",
    data: null
  });
};

exports.forget = async (req, res) => {
  const { email } = req.body;
  const verify = Math.floor(Math.random() * 99999999999) + 100000000;
  const user = await User.findOne({ email: email });
  if (user) {
    user.verify = verify;
    user.save();
    sendMail(user.email, verify, user.name, "forget");
    res.status(200).json({
      code: 200,
      message: "send message success",
      data: null
    });
  } else {
    res.status(200).json({
      code: 400,
      message: "send message success",
      data: null
    });
  }
};
exports.reset_password = async (req, res) => {
  const { email, code, password } = req.body;
  const user = await User.findOne({ email, verify: code });
  if (user) {
    user.password = password;
    user.save();
    res.status(200).json({
      code: 200,
      message: "send message success",
      data: null
    });
  } else {
    res.status(200).json({
      code: 400,
      message: "some wrong",
      data: null
    });
  }
};
