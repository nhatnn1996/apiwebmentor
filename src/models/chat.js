"use strict";
const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        auth: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        room: {
            type: Schema.Types.ObjectId,
            ref: "Room"
        },
        content: {
            type: String
        }
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model("Chat", MessageSchema);
