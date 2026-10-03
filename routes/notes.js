const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notes');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', notesController.getAll);
router.get('/:id', notesController.getSingle);
router.post('/', isAuthenticated, notesController.createNote);
router.put('/:id', isAuthenticated, notesController.updateNote);
router.delete('/:id', isAuthenticated, notesController.deleteNote);

module.exports = router;