const path = require('path');
const express = require('express');
const compression = require('compression');
// const hbs = require('hbs');
const routes = require('./routes');
const db = require('./configs/db');

const app = express();
app.use(compression()); // compress server-response

// handle CORS
const corsHandler = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, token'
  );
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE, PATCH');
  next();
};
app.use(corsHandler);

// parse request data to JSON object
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// register the DB-connection as global variable
global.db = db;

// set up handlebars engine and view location
app.set('view engine', 'hbs'); // .set('views', path.join(__dirname, '../templates/views'));
// hbs.registerPartials(path.join(__dirname, '../templates/partials'))

// error-handler middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // console.log(`${err.name || err.error.name} --- ${err.message || err.error.message}`);

  const isBRE = err.name === ReferenceError.name; // bad-reference error
  const isTAE = ['token'].includes(err.message.toLowerCase())
    && ['missing', 'invalid', 'expired'].includes(err.message);

  // client-side (input) error
  const isCSE = [EvalError.name, Error.name, RangeError.name].includes(err.name);

  // eslint-disable-next-line no-nested-ternary
  res.status(err.statusCode || (isBRE ? 404 : isTAE ? 401 : isCSE ? 400 : 500)).send({
    status: 'error',
    error: err.message || err.error.message,
  });
};

app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/v1', routes(express.Router()), errorHandler);

module.exports = app;
