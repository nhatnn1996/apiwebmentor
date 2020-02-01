const express = require("express");
const Router = express.Router();
const Specialized = require("../../models/specialized");
const Semester = require("../../models/semester");

Router.get("/", async (req, res, next) => {
    const specialized = await Specialized.find();
    const semester = await Semester.find();
    return res.status(200).json({ specialized, semester });
});

module.exports = Router;
