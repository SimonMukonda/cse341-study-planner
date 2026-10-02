const mongoose = require('mongoose');
const Course = require('../models/course');

const getAll = async (req, res) => {
try {
const courses = await Course.find();
res.status(200).json(courses);
} catch (err) {
res.status(500).json({ message: 'Server error', error: err.message });
}
};

const getSingle = async (req, res) => {
try {
if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
return res.status(400).json({ message: 'Invalid course id' });
}
const course = await Course.findById(req.params.id);
if (!course) {
return res.status(404).json({ message: 'Course not found' });
}
res.status(200).json(course);
} catch (err) {
res.status(500).json({ message: 'Server error', error: err.message });
}
};

const createCourse = async (req, res) => {
try {
const course = await Course.create(req.body);
res.status(201).json(course);
} catch (err) {
if (err.name === 'ValidationError') {
return res.status(400).json({ message: err.message });
}
res.status(500).json({ message: 'Server error', error: err.message });
}
};

const updateCourse = async (req, res) => {
try {
if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
return res.status(400).json({ message: 'Invalid course id' });
}
const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
new: true,
runValidators: true
});
if (!course) {
return res.status(404).json({ message: 'Course not found' });
}
res.status(200).json(course);
} catch (err) {
if (err.name === 'ValidationError') {
return res.status(400).json({ message: err.message });
}
res.status(500).json({ message: 'Server error', error: err.message });
}
};

const deleteCourse = async (req, res) => {
try {
if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
return res.status(400).json({ message: 'Invalid course id' });
}
const course = await Course.findByIdAndDelete(req.params.id);
if (!course) {
return res.status(404).json({ message: 'Course not found' });
}
res.status(200).json({ message: 'Course deleted' });
} catch (err) {
res.status(500).json({ message: 'Server error', error: err.message });
}
};

module.exports = { getAll, getSingle, createCourse, updateCourse, deleteCourse };



