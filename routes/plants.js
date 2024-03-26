
/*** Plants ***/
const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');
const plantsController = require('../controllers/plants');

router.get('/', plantsController.getAll);

router.get('/:id', plantsController.getSingle);

router.post('/', validation.plantCheck, plantsController.createPlant);

router.put('/:id', validation.plantCheck, plantsController.updatePlant);

router.delete('/:id', plantsController.deletePlant);

router.get('/category/:name', plantsController.getPlantsByCategoryName);


module.exports = router;

