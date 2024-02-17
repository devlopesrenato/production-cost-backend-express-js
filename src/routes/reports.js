const express = require('express');
const router = express.Router();
const reports = require('../repositories/reports.repository');

router.get('/costPerProduction', reports.getCostPerProduction);



module.exports = router;