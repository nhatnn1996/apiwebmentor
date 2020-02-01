const Contract = require("../models/contract");
const response = require("../helper/response");

exports.create = async function(req, res, next) {
    const { user, time, mentor } = req.body;
    let rent = new Contract({ user, mentor, time, cost: req.mentor.cost });
    rent.save(function(err, result) {
        if (err) {
            return response.resError(422, err, res);
        } else {
            return response.resData(200, result._doc, res);
        }
    });
};

exports.read = async function(req, res) {
    try {
        const _id = req.user._id;
        const history = await Contract.find({
            member: { $in: _id }
        })
            .populate("member")
            .exec();
        const listHis = history.map(item => {
            const his = { time: item.time };

            if (_id.toString() === item.member[0]._id.toString()) {
                his.partner = item.member[1];
            } else {
                his.partner = item.member[0];
            }

            his.mentor =
                _id.toString() === item.mentor.toString() ? true : false;
            return his;
        });

        res.status(200).send({
            code: 200,
            message: "Founded contracts",
            data: listHis
        });
    } catch (error) {
        console.log(error);
        res.status(200).send({
            code: 400,
            message: "not found user",
            data: null
        });
    }
};

exports.update = async function(req, res, next) {
    try {
        const { _id, content, rate } = req.body;
        // update the rent
        let contract = await Contract.findOne({ room: _id })
            .sort({ createdAt: -1 })
            .exec();
        contract.rate = rate;
        contract.content = content;
        contract.save();

        res.status(200).send({
            code: 200,
            message: "rating success",
            data: null
        });
    } catch (error) {
        console.log(error);
        res.status(200).send({
            code: 400,
            message: "rating fail",
            data: null
        });
    }
};

exports.rate = async function(req, res) {
    try {
        const _id = req.params.id;
        const contract = await Contract.find({
            mentor: _id,
            rate: { $in: [1, 2, 3, 4, 5] }
        })
            .populate("member")
            .exec();
        const listRate = contract.map(item => {
            const rate = {
                time: item.time,
                content: item.content,
                rate: item.rate,
                createdAt: item.updatedAt
            };

            if (_id.toString() === item.member[0]._id.toString()) {
                rate.user = item.member[1];
            } else {
                rate.partner = item.member[0];
            }

            return rate;
        });

        res.status(200).send({
            code: 200,
            message: "Founded contracts",
            data: listRate
        });
    } catch (error) {
        console.log(error);
        res.status(200).send({
            code: 400,
            message: "not found user",
            data: null
        });
    }
};
