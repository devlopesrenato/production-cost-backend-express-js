const express = require('express');
const router = express.Router();
const Production = require('../src/repositories/production.repository');

router.get('/', Production.getProduction);

router.post('/', Production.postProduction);

router.put('/', Production.updateProduction);

router.delete('/', Production.deleteProduction);

module.exports = router;