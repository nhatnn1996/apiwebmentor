const Room = require("../models/room");

exports.read = async function(req, res) {
    const { _id } = req.user;
    const rooms = await Room.find({ member: { $in: [_id] }, hidden: false })
        .populate("member")
        .exec();

    return res
        .status(200)
        .json({ code: 200, message: "List rooms user joint", data: rooms });
};
