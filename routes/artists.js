
/*** Artists ***/
const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');
const artistsController = require('../controllers/artists');

router.get('/', artistsController.getAll);

router.get('/:id', artistsController.getSingle);

router.post('/', validation.artistCheck, artistsController.createArtist);

router.put('/:id', validation.artistCheck, artistsController.updateArtist);

router.delete('/:id', artistsController.deleteArtist);

module.exports = router;

