"use strict";
const User = require("../models/user");
const Mentor = require("../models/mentor");
const sendMail = require("../service/sendMail");
const Rule = require("../helper/rule");

const {
    resData,
    resError,
    checkNotExist,
    resSuccess,
    resValidate
} = require("../helper/response");

exports.checkMail = async (req, res, next) => {
    const email = req.body.email;
    checkNotExist(email, "Bạn cần nhập email vào", res);
    User.findOne({ email }, function(err, result) {
        if (err) throw err;
        if (result) resValidate(false, res);
        else resValidate(true, res);
    });
};

exports.show = async (req, res, next) => {
    const _id = req.user._id;
    const mentor = await Mentor.findOne({ user: _id });
    const user = await User.findById(_id);

    const data = { ...Rule.user(user), mentor: Rule.mentor(mentor) };

    res.status(200).json({
        code: 200,
        message: "infomation",
        data: data
    });
};

exports.read = async (req, res, next) => {
    const _id = req.params.id;
    const mentor = await Mentor.findOne({ user: _id })
        .populate("specialized")
        .populate("semester");
    const user = await User.findById(_id);

    if (user) {
        const data = {
            ...Rule.user(user),
            mentor: Rule.mentor(mentor)
        };
        res.status(200).json({
            code: 200,
            message: "infomation",
            data: data
        });
    } else {
        res.status(200).json({
            code: 400,
            message: "not found",
            data: null
        });
    }
};
exports.requireInfo = async (req, res, next) => {
    const userUpdate = req.body;
    if (req.file) {
        User.updateOne(
            { _id: userUpdate.id },
            { avatar: req.file.avatar },
            function(err, result) {
                if (err) {
                    resError(422, "Cant not upload image", res);
                }
            }
        );
    }
    User.findOneAndUpdate(
        { _id: userUpdate.id },
        {
            school: userUpdate.school,
            specialized: userUpdate.specialized,
            code: userUpdate.code
        },
        function(err, result) {
            if (result) {
                resData(200, result._doc, res);
            } else {
                resError(404, "Not Found", res);
            }
        }
    );
};

exports.verify_again = async (req, res) => {
    try {
        console.log("hádhaksjdhksjhk");
        const id = req.user._id;
        const verify = Math.floor(Math.random() * 99999999999) + 100000000;
        const user = await User.findById(id);
        user.verify = verify;
        user.save();
        sendMail(user.email, verify, user.name);
        res.status(200).json({
            code: 200,
            message: "send message success",
            data: null
        });
    } catch (error) {
        console.log(error);
    }
};
