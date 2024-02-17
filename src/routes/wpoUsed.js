const express = require('express');
const router = express.Router();
const WPOUsed = require('../repositories/wpoUsed.repository');

router.get('/', WPOUsed.getWPOUsed);

router.post('/', WPOUsed.postWPOUsed)

router.put('/', WPOUsed.updateWPOUsed)

router.delete('/', WPOUsed.deleteWPOUsed)


module.exports = router;