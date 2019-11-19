const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
const router = express.Router();


// handle CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE, PATCH');
    next();
});


// parse request data to JSON object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', routes(router));

// set a default route
app.use('*', (req, res) => res.status(404).json({ status: 'error', error: 'Page no longer exists' }));

module.exports = app;
