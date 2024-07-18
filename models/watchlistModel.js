const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
    company: String,
    description: String,
    initial_price: Number,
    symbol: String,
});

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

module.exports = Watchlist;