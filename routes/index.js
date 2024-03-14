const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/plants', require('./plants'));
router.use('/care', require('./care'));
router.use('/category', require('./category'));
router.use('/caretype', require('./caretype'));

module.exports = router;