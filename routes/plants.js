
/*** Plants ***/
const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');
const plantsController = require('../controllers/plants');

router.get('/', plantsController.getAll);

router.get('/:id', plantsController.getSingle);

router.post('/', validation.deletePlantCheck, plantsController.createPlant);

router.put('/:id', validation.deletePlantCheck, plantsController.updatePlant);

router.delete('/:id', plantsController.deletePlant);

module.exports = router;

