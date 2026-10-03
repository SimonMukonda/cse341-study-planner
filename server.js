require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 3000;

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(port, () => console.log('Server running on port ' + port));
    })
    .catch((err) => {
        console.error('Database connection failed:', err.message);
    });