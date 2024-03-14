
/*** ArtistSongs ***/
const express = require('express');
const router = express.Router();

const artistsongsController = require('../controllers/artistsongs');

router.get('/', artistsongsController.getAll);
router.get('/:id', artistsongsController.getAllArtistSongs);

module.exports = router;

