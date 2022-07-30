const express = require('express');
const router = express.Router();
const Feedstock = require('../src/repositories/feedstockUsed.repository');

router.get('/', Feedstock.getFeedstockUsed);

router.post('/', Feedstock.postFeedstockUsed)

router.put('/', Feedstock.updateFeedstockUsed)

router.delete('/', Feedstock.deleteFeedstockUsed)


module.exports = router;