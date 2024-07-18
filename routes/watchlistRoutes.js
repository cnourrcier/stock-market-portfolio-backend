const express = require('express');
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');
const router = express.Router();

router.get('/', getWatchlist);
router.post('/', addToWatchlist);
router.delete('/:symbol', removeFromWatchlist);

module.exports = router;