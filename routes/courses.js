const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/courses');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', coursesController.getAll);
router.get('/:id', coursesController.getSingle);
router.post('/', isAuthenticated, coursesController.createCourse);
router.put('/:id', isAuthenticated, coursesController.updateCourse);
router.delete('/:id', isAuthenticated, coursesController.deleteCourse);

module.exports = router;