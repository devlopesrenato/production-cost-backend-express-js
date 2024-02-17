const express = require('express');
const router = express.Router();
const settings = require('../repositories/settings.repository');

router.get('/', settings.getSettings);

router.get('/:id', settings.getSettingById);

router.post('/', settings.postSettings);

router.put('/', settings.putSettings);

module.exports = router;