
/*** Songs ***/
const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');
const songsController = require('../controllers/songs');

router.get('/', songsController.getAll);

router.get('/:id', songsController.getSingle);

router.post('/', validation.songCheck, songsController.createSong);

router.put('/:id', validation.songCheck, songsController.updateSong);

router.delete('/:id', songsController.deleteSong);

module.exports = router;

