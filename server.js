const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const db = require('./db/db');
const Router = require('./routes/routes');
const multer = require('multer');

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 9879;
console.log("PORT:", PORT);

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    }
    next(err);
});


app.use('/api/tiffin', Router)

app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start the server
try {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    console.error("Error starting server:", error);
}

db()