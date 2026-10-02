const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        courseCode: { type: String, required: true, trim: true },
        title: { type: String, required: true, trim: true },
        instructor: { type: String, trim: true },
        semester: { type: String, required: true, trim: true },
        credits: { type: Number, min: 0, max: 20 },
        meetingDays: { type: [String], default: [] },
        meetingTime: { type: String, trim: true },
        location: { type: String, trim: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);