const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const path = require('path');

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
    price_2002: Number,
    price_2007: Number,
    symbol: String,
});

const Stock = mongoose.model('Stock', stockSchema);

const seedData = async () => {
    try {
        const dataPath = path.join(__dirname, 'stocks.json');
        const data = fs.readFileSync(dataPath, 'utf8');
        const stocks = JSON.parse(data);

        await Stock.insertMany(stocks);
        console.log('Dummy data inserted successfully');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error inserting dummy data:', error);
    }
};

seedData();
