const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
    {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        dueDate: { type: Date, required: true },
        priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
        status: {
            type: String,
            enum: ['not started', 'in progress', 'submitted', 'graded'],
            default: 'not started'
        },
        estimatedHours: { type: Number, min: 0 },
        pointsPossible: { type: Number, min: 0 },
        grade: { type: Number, min: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);