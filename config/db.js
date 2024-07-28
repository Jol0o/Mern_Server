const mongoose = require('mongoose');
const Review = require('../models/ReviewModel');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
        await Review.collection.createIndex({ content: 'text' });
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
