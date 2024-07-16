const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const stockSchema = new mongoose.Schema({
    company: String,
    description: String,
    initial_price: Number,
    symbol: String,
});

const Stock = mongoose.model("Stock", stockSchema);

const watchlistSchema = new mongoose.Schema({
    company: String,
    description: String,
    initial_price: Number,
    symbol: String,
});

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

app.get("/api/stocks", async (req, res) => {
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
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/watchlist", async (req, res) => {
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
});

app.post("/api/watchlist", async (req, res) => {
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
});

app.delete("/api/watchlist/:symbol", async (req, res) => {
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
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
