const mongoose = require('mongoose');
require('dotenv').config()
const mongoLink = process.env.MONGOLINK;

const db = async () => {
    try {
        await mongoose.connect(mongoLink);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Internal server error in database connection:", error);
    }
};

module.exports = db;
