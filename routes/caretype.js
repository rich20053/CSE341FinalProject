/*** CareType ***/
const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');
const careTypeController = require('../controllers/caretype');

router.get('/', careTypeController.getAll);

router.get('/:id', careTypeController.getSingle);

router.post('/', validation.careTypeCheck, careTypeController.createCareType);

router.put('/:id', validation.careTypeCheck, careTypeController.updateCareType);

router.delete('/:id', careTypeController.deleteCareType);

module.exports = router;

