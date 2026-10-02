const express = require('express');
const router = express.Router();
const assignmentsController = require('../controllers/assignments');

router.get('/', assignmentsController.getAll);
router.get('/:id', assignmentsController.getSingle);
router.post('/', assignmentsController.createAssignment);
router.put('/:id', assignmentsController.updateAssignment);
router.delete('/:id', assignmentsController.deleteAssignment);

module.exports = router;