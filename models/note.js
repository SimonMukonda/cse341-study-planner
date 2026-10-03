const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
    {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: [true, 'courseId is required'] },
        title: {
            type: String,
            required: [true, 'title is required'],
            trim: true,
            maxlength: [100, 'title must be 100 characters or fewer']
        },
        content: { type: String, required: [true, 'content is required'], trim: true },
        tags: { type: [String], default: [] },
        pinned: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);