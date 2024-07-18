const Watchlist = require('../models/watchlistModel');

// Retrieve watchlist items based on query parameters.
exports.getWatchlist = async (req, res) => {
    try {
        const { sortBy, minPrice, maxPrice } = req.query;
        let filter = {};
        if (minPrice) filter.initial_price = { $gte: Number(minPrice) };
        if (maxPrice) filter.initial_price = filter.initial_price ? { ...filter.initial_price, $lte: Number(maxPrice) } : { $lte: Number(maxPrice) };

        let watchlist = await Watchlist.find(filter);
        if (sortBy) {
            watchlist = watchlist.sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1);
        }
        res.json(watchlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Add a stock to the watchlist.
exports.addToWatchlist = async (req, res) => {
    try {
        const {
            company,
            description,
            initial_price,
            symbol,
        } = req.body;

        const alreadyInWatchlist = await Watchlist.find({ symbol });
        if (alreadyInWatchlist.length) {
            return res.json({
                message: "Stock is already in watchlist"
            })
        }
        const watchlist = new Watchlist({
            company,
            description,
            initial_price,
            symbol,
        });
        await watchlist.save();
        res.json({
            message: "Stock added to watchlist successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Remove a stock from the watchlist.
exports.removeFromWatchlist = async (req, res) => {
    try {
        const { symbol } = req.params;
        const deletedStock = await Watchlist.findOneAndDelete({ symbol });
        const watchlist = await Watchlist.find();
        if (deletedStock) {
            res.json({
                watchlist,
                message: "Stock removed from watchlist successfully"
            });
        } else {
            res.status(404).json({ error: "Stock not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};