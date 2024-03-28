
/*** Care ***/
const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');
const careController = require('../controllers/care');

router.get('/', careController.getAll);

router.get('/:id', careController.getSingle);

router.post('/', validation.careCheck, careController.createCare);

router.put('/:id', validation.careCheck, careController.updateCare);

router.delete('/:id', careController.deleteCare);

router.get('/plant/:name', careController.getCareByPlantName);

module.exports = router;

