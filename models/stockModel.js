const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    company: String,
    description: String,
    initial_price: Number,
    symbol: String,
});

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;