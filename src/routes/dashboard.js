const express = require('express');
const router = express.Router();
const dash = require('../repositories/dashboard.repository');

router.get('/', dash.getDashboard);

module.exports = router;