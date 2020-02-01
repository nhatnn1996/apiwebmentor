const Contract = require("./models/contract");
const User = require("./models/user");
const Room = require("./models/room");
const Mentor = require("./models/mentor");
const Chat = require("./models/chat");

exports = module.exports = function(io, obj) {
    io.on("connection", socket => {
        socket.on("on-mentor", function(data) {
            const index = obj.ONLINES.findIndex(
                element => element.id === data.id
            );

            if (index >= 0) obj.ONLINES.splice(index, 1);

            data.socket = socket.id;
            data.status = "online";
            obj.ONLINES.push(data);

            io.emit("load-mentor-online", obj.ONLINES);
        });

        socket.on("load", () => {
            io.emit("load-mentor-online", obj.ONLINES);
        });
        socket.on("connect-mentor", async data => {
            const findMentor = obj.ONLINES.find(e => e.id === data.mentor.id);
            let room = {};
            room.name =
                data.mentor.id > data.user.id
                    ? data.mentor.id + data.user.id
                    : data.user.id + data.mentor.id;
            const old_room = await Room.findOne({ name: room.name })
                .populate("member")
                .exec();

            if (!old_room) {
                newRoom = await Room.create({
                    name: room.name,
                    member: [data.user.id, data.mentor.id],
                    contract: {
                        time: data.time,
                        mentor: data.mentor.id,
                        start: null
                    }
                });
                room = await Room.findOne({ _id: newRoom._id })
                    .populate("member")
                    .exec();
            } else {
                old_room.contract = {
                    time: data.time,
                    mentor: data.mentor.id,
                    start: null
                };
                old_room.hidden = false;
                old_room.save();
                old_room.updatedAt = new Date();
                room = old_room;
            }

            if (findMentor)
                io.to(findMentor.socket).emit("load-rent-mentor", room);
            socket.emit("create-room", room);
        });

        socket.on("delete-room", async data => {
            const room = await Room.findById({ _id: data._id });
            room.hidden = true;
            room.save();
            io.to(data._id).emit("delete-room", data);
        });

        socket.on("accept-contract", async data => {
            const info_mentor = await Mentor.findOne({
                user: data.contract.mentor
            });
            const mentor = await User.findById(data.contract.mentor);
            mentor.surplus = mentor.surplus + info_mentor.cost;
            mentor.scores = mentor.scores + 20;
            mentor.save();

            const id_user = data.member.find(
                e => e._id !== data.contract.mentor
            )._id;
            const user = await User.findById(id_user);
            user.scores = user.scores + 20;
            user.surplus = user.surplus - info_mentor.cost;
            user.save();

            const contract = new Contract();
            contract.room = data._id;
            contract.time = data.contract.time;
            contract.cost = info_mentor.cost;
            contract.mentor = data.contract.mentor;
            contract.member = [user._id, mentor._id];
            await contract.save();

            data.contract.start = Date.parse(new Date());
            const room = await Room.findById(data._id);
            room.contract = data.contract;
            room.save();

            io.to(data._id).emit("accept-contract", data);
        });

        socket.on("send_message", data => {
            io.to(data.user.to).emit("reply_request_rent", data);
        });

        // Event mentor
        socket.on("joint-room", data => {
            socket.join(data.room);
        });

        socket.on("chat", data => {
            Chat.create({
                auth: data.auth.id,
                content: data.content,
                room: data.room
            });
            io.to(data.room).emit("chat", data);
        });

        socket.on("all-room", data => {
            socket.join(data);
        });

        // END event mento

        socket.on("off-mentor", data => {
            const index = obj.ONLINES.findIndex(element => {
                return element.id === data.id;
            });

            if (index >= 0) {
                obj.ONLINES.splice(index, 1);
            }
            io.emit("load-mentor-online", obj.ONLINES);
        });

        socket.on("disconnect", () => {
            const index = obj.ONLINES.findIndex(
                element => element.socket === socket.id
            );
            if (index >= 0) {
                obj.ONLINES.splice(index, 1);
            }
            io.emit("load-mentor-online", obj.ONLINES);
        });
    });
};
