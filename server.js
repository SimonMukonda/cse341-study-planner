const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
res.send('Study Planner API');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/courses', require('./routes/courses'));
app.use('/assignments', require('./routes/assignments'));
app.use('/users', require('./routes/users'));
app.use('/notes', require('./routes/notes'));

mongoose
.connect(process.env.MONGODB_URI)
.then(() => {
app.listen(port, () => console.log('Server running on port ' + port));
})
.catch((err) => {
console.error('Database connection failed:', err.message);
});