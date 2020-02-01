"use strict";
const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const ContractSchema = new Schema(
    {
        room: {
            type: Schema.Types.ObjectId,
            ref: "Room"
        },
        mentor: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        member: [{ type: Schema.Types.ObjectId, ref: "User" }],
        status: {
            type: Boolean,
            default: false
        },
        // Giá tiền thuê tại thời điểm đó
        cost: {
            type: Number,
            default: 0
        },
        // Thời gian thê
        time: {
            type: Number
        },
        // Đánh giá
        rate: {
            type: Number,
            min: 1,
            max: 5
        },
        // Nội dung đánh giá
        content: {
            type: String
        }
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model("Contract", ContractSchema);
