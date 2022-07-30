const express = require('express');
const router = express.Router();
const WPO = require('../src/repositories/wpo.repository');

router.get('/', WPO.getWPO);

router.post('/', WPO.postWPO)

router.put('/', WPO.updateWPO)

router.delete('/', WPO.deleteWPO)


module.exports = router;