
/*** CareType ***/
const express = require('express');
const router = express.Router();

const careTypeController = require('../controllers/caretype');

router.get('/', careTypeController.getAll);
router.get('/:id', careTypeController.getCareTypeById);

module.exports = router;

