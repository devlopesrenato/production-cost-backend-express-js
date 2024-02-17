const express = require('express');
const router = express.Router();
const SimpleMeasure = require('../repositories/simpleMeasure.repository');

router.get('/', SimpleMeasure.getSimpleMeasure);

router.post('/', SimpleMeasure.postSimpleMeasure)

router.put('/', SimpleMeasure.updateSimpleMeasure)

router.delete('/', SimpleMeasure.deleteSimpleMeasure)


module.exports = router;