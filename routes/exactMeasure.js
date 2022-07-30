const express = require('express');
const router = express.Router();
const ExactMeasure = require('../src/repositories/exactMeasure.repository');

router.get('/', ExactMeasure.getExactMeasure);

// router.post('/', ExactMeasure.postExactMeasure)

// router.put('/', ExactMeasure.updateExactMeasure)

// router.delete('/', ExactMeasure.deleteExactMeasure)


module.exports = router;