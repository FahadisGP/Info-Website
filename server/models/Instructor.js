const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InstructorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: String,
    phone: String,
    building: String,
    officeNum: String,
    officeHours: Array,
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Instructors", InstructorSchema);