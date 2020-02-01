"use strict";

const Mentor = require("../models/mentor");
const User = require("../models/user");
const respone = require("../helper/response");
const Rule = require("../helper/rule");
const fs = require("fs");
// const http = require()
exports.created = async function(req, res, next) {
    const _id = req.user._id;
    const {
        specialized,
        semester,
        description,
        cost,
        skype,
        achievements
    } = req.body;
    if (
        !specialized ||
        !semester ||
        !description ||
        !cost ||
        !skype ||
        !achievements
    ) {
        return res.status(400).send("Bad request!");
    }
    const bodydata = {
        specialized,
        semester,
        description,
        cost,
        skype,
        achievements: JSON.parse(achievements),
        user: _id
    };
    try {
        const mentor = await Mentor.findOneAndUpdate(
            { user: req.user._id },
            { ...bodydata }
        );
        if (!mentor) {
            mentor = await Mentor.create({ ...bodydata });
        }
        const avatar = req.file.path.replace(/\\/g, "/");
        const user = await User.findOneAndUpdate({ _id }, { avatar: avatar });
        if (user.avatar !== "uploads/avatar/default.jpg") {
            fs.unlink(user.avatar, () => {
                console.log("Delete image" + user.avatar);
            });
        }

        user.avatar = avatar;
        const mentors = await Mentor.findById(mentor._id)
            .populate("specialized")
            .populate("semester");
        const data = {
            ...Rule.user(user),
            mentor: Rule.mentor(mentors)
        };
        return res
            .status(200)
            .json({ code: 200, message: "success", data: data });
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ code: 400, message: "some wrong server", data: error });
    }
};

exports.getme = async function(req, res, next) {
    const _id = req.user.id;
    const mentor = await Mentor.findOne({ user: _id }).populate("specialized");
    return res.status(200).json(mentor);
};

exports.read = async function(req, res, next) {
    const mentor = await Mentor.findOne({ _id: req.params.id })
        .populate("specialized")
        .populate("user");
    return res.status(200).json(mentor);
};

exports.all = function(req, res, next) {
    Mentor.find()
        .populate("specialized")
        .exec(function(err, result) {
            if (err) {
                return next(err);
            }
            if (result) {
                return res.status(200).json({
                    data: [...result],
                    type: "success",
                    message: "Get all user success."
                });
            }
        });
};

exports.update = function(req, res, next) {
    const _id = req.params.id;
    const mentor = req.body;
    Mentor.updateOne({ _id }, { $set: mentor }, function(err, reuslt) {
        if (err) {
            return res.status(400).json({
                type: "error",
                message: err
            });
        }
        if (reuslt) {
            return res.status(400).json({
                type: "success",
                message: "Update success"
            });
        }
    });
};

exports.search = function(req, res, next) {
    const { keyword } = req.query;
    Mentor.find({ nickname: { $regex: ".*" + keyword + ".*", $options: "i" } })
        .populate("specialized")
        .exec(function(err, result) {
            if (err) {
                return respone.resError(300, err, res);
            }
            if (result) {
                return res.status(200).json(result);
            }
        });
};

exports.searchBySpecialized = function(req, res, next) {
    const { specialized } = req.query;
    Mentor.find({ specialized })
        .populate("specialized")
        .exec(function(err, result) {
            if (err) {
                return respone.resError(300, err, res);
            }
            if (result) {
                return res.status(200).json(result);
            }
        });
};

exports.delete = function(req, res, next) {
    const _id = req.params.id;
    Mentor.deleteOne({ _id }, function(err, result) {
        if (result) {
            return res.status(400).send({
                type: "success",
                message: "Delete Tutor success"
            });
        }
    });
};

exports.info = function(req, res, next) {
    const _id = req.params.id;
    Mentor.findById({ _id }, function(err, result) {
        if (err) next(err);
        if (result) {
            respone.resData(200, result._doc, res);
        }
    });
};
