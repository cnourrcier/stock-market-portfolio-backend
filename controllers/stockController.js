const Stock = require('../models/stockModel');

// Handle the retrieval of stocks based on query parameters
exports.getStocks = async (req, res) => {
    try {
        const { sortBy, minPrice, maxPrice } = req.query;
        let filter = {};
        if (minPrice) filter.initial_price = { $gte: Number(minPrice) };
        if (maxPrice) filter.initial_price = filter.initial_price ? { ...filter.initial_price, $lte: Number(maxPrice) } : { $lte: Number(maxPrice) };

        let stocks = await Stock.find(filter);
        if (sortBy) {
            stocks = stocks.sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1);
        }
        res.json(stocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
