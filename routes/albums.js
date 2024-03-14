
/*** Albums ***/
const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');
const albumsController = require('../controllers/albums');

router.get('/', albumsController.getAll);

router.get('/:id', albumsController.getSingle);

router.post('/', validation.albumCheck, albumsController.createAlbum);

router.put('/:id', validation.albumCheck, albumsController.updateAlbumById);

router.delete('/:id', albumsController.deleteAlbum);

module.exports = router;

