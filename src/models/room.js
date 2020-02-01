const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const RoomSchema = new Schema(
    {
        name: {
            type: String
        },
        member: {
            type: [{ type: Schema.Types.ObjectId, ref: "User" }]
        },
        mentor: {
            type: Schema.Types.ObjectId,
            ref: "Mentor"
        },
        hidden: {
            type: Boolean,
            default: false
        },
        contract: {
            mentor: {
                type: Schema.Types.ObjectId,
                ref: "user"
            },
            time: String,
            start: String
        }
    },
    { timestamps: true }
);
// have 2 property time at create and time at update
module.exports = mongoose.model("Room", RoomSchema);
