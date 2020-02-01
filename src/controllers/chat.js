const Chat = require("../models/chat");

exports.chatInRoom = async function(req, res) {
    const { room } = req.params;
    const listChat = await Chat.find({ room: room })
        .populate("auth")
        .limit(20)
        .sort({ createdAt: -1 })
        .exec();
    return res
        .status(200)
        .json({
            code: 200,
            message: "List chat of user",
            data: listChat.reverse()
        });
};
