const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const achievements = new Schema({
    time: String,
    content: String
});

const MentorSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            unique: true
        },
        specialized: {
            type: Schema.Types.ObjectId,
            ref: "Specialized"
        },
        cost: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        semester: {
            type: Schema.Types.ObjectId,
            ref: "Semester"
        },
        achievements: {
            type: [achievements],
            required: false
        },
        skype: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);
// have 2 property time at create and time at update
module.exports = mongoose.model("Mentor", MentorSchema);
