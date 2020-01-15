const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
const router = express.Router();


// handle CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, token');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE, PATCH');
    next();
});


// parse request data to JSON object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/v1', routes(router), (err, req, res, next) => {
    const isCSE = (err.name === 'TokenExpiredError') || (err.name === 'TypeError') || (err.name === 'Error');
    res.status(isCSE ? 400 : 500).send({ status: 'error', error: err.message || err.error.message });
});

// set a default route
app.use('*', (req, res) => res.status(404).json({ status: 'error', error: 'Page no longer exists' }));

module.exports = app;
