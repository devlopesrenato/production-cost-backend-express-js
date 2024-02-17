const express = require('express');
const router = express.Router();
const Feedstock = require('../repositories/feedstock.repository');

router.get('/', Feedstock.getFeedstock);

router.post('/', Feedstock.postFeedstock)

router.put('/', Feedstock.updateFeedstock)

router.delete('/', Feedstock.deleteFeedstock)


module.exports = router;