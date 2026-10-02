const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Study Planner API');
});

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(port, () => console.log('Server running on port ' + port));
    })
    .catch((err) => {
        console.error('Database connection failed:', err.message);
    });