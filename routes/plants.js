
/*** Plants ***/
const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');
const plantsController = require('../controllers/plants');

router.get('/', plantsController.getAll);

router.post('/', validation.plantCheck, plantsController.createPlant);

router.put('/:id', validation.plantCheck, plantsController.updatePlant);

router.delete('/:id', plantsController.deletePlant);

router.get('/category/:name', plantsController.getPlantsByCategoryName);

router.get('/color/:color', plantsController.getPlantsByColor);

router.get('/flower/:direction', plantsController.getPlantsOrderedByDaysToFlower);

router.get('/full', plantsController.getAllFull);

router.get('/full/:id', plantsController.getSingleFull);

router.get('/full/category/:name', plantsController.getFullPlantsByCategoryName);

router.get('/full/color/:color', plantsController.getFullPlantsByColor);

router.get('/full/name/:name', plantsController.getFullPlantsByName);

router.get('/full/zone/:zone', plantsController.getFullPlantsByHardinessZone);

router.get('/germination/:direction', plantsController.getPlantsOrderedByDaysToGermination);

router.get('/harvest/:direction', plantsController.getPlantsOrderedByDaysToHarvest);

router.get('/height/:direction', plantsController.getPlantsOrderedByHeight);

router.get('/height/:height', plantsController.getPlantsByHeight);

router.get('/height/:lowheight/:topheight', plantsController.getPlantsByHeightRange);

router.get('/name/:name', plantsController.getPlantsByName);

router.get('/sciname/:name', plantsController.getPlantsByScientificName);

router.get('/zone/:zone', plantsController.getPlantsByHardinessZone);

router.get('/:id', plantsController.getSingle);

module.exports = router;

