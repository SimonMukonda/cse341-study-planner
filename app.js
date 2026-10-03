const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const passport = require('./config/passport');

const app = express();

app.set('trust proxy', 1);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

let store;
if (process.env.NODE_ENV !== 'test') {
    const MongoStore = require('connect-mongo').default || require('connect-mongo');
    store = MongoStore.create({ mongoUrl: process.env.MONGODB_URI });
}

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'dev-secret',
        resave: false,
        saveUninitialized: false,
        store,
        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('Study Planner API');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', require('./routes/auth'));
app.use('/courses', require('./routes/courses'));
app.use('/assignments', require('./routes/assignments'));
app.use('/users', require('./routes/users'));
app.use('/notes', require('./routes/notes'));

module.exports = app;