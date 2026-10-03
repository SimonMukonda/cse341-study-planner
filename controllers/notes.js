const mongoose = require('mongoose');
const Note = require('../models/note');
const Course = require('../models/course');

const getAll = async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getSingle = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid note id' });
        }
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(note);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const createNote = async (req, res) => {
    try {
        const { courseId } = req.body;
        if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'A valid courseId is required' });
        }
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ message: 'courseId does not match any course' });
        }
        const note = await Note.create(req.body);
        res.status(201).json(note);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const updateNote = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid note id' });
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
        const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(note);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const deleteNote = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid note id' });
        }
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getAll, getSingle, createNote, updateNote, deleteNote };