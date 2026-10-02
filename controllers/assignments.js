const mongoose = require('mongoose');
const Assignment = require('../models/assignment');
const Course = require('../models/course');

const getAll = async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.status(200).json(assignments);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getSingle = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid assignment id' });
        }
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.status(200).json(assignment);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const createAssignment = async (req, res) => {
    try {
        const { courseId } = req.body;
        if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'A valid courseId is required' });
        }
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ message: 'courseId does not match any course' });
        }
        const assignment = await Assignment.create(req.body);
        res.status(201).json(assignment);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const updateAssignment = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid assignment id' });
        }
        if (req.body.courseId) {
            if (!mongoose.Types.ObjectId.isValid(req.body.courseId)) {
                return res.status(400).json({ message: 'Invalid courseId' });
            }
            const course = await Course.findById(req.body.courseId);
            if (!course) {
                return res.status(400).json({ message: 'courseId does not match any course' });
            }
        }
        const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.status(200).json(assignment);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const deleteAssignment = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid assignment id' });
        }
        const assignment = await Assignment.findByIdAndDelete(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.status(200).json({ message: 'Assignment deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getAll, getSingle, createAssignment, updateAssignment, deleteAssignment };