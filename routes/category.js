const express = require('express');
const router = express.Router();
const Category = require('../src/repositories/category.repository');

router.get('/', Category.getCategory);

router.post('/', Category.postCategory)

router.put('/', Category.updateCategory)

router.delete('/', Category.deleteCategory)


module.exports = router;