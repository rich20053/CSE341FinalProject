
/*** Category ***/
const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');
const categoryController = require('../controllers/category');

router.get('/', categoryController.getAll);

router.get('/:id', categoryController.getSingle);

router.post('/', validation.categoryCheck, categoryController.createCategory);

router.put('/:id', validation.categoryCheck, categoryController.updateCategory);

router.delete('/:id', categoryController.deleteCategory);

module.exports = router;

