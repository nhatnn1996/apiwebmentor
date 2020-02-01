const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const semesterSchema = new Schema({
    name: {
        type: String,
        required: true
        // Description: Học kì
    },
    trash: {
        type: Boolean,
        default: false
    }
    // Description: Bỏ vào thùng rác
});
module.exports = mongoose.model("Semester", semesterSchema);
