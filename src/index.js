require('dotenv').config();

const app = require('./app');

// app.set('port', process.env.PORT || 3000);
const server = app.listen(process.env.PORT || 3000, (error) => {
  console.log(error ? `Error: ${error}...` : `Listening on PORT: ${server.address().port}`);
}).on('error', (error) => {
  console.error('Error-event occurred: ', error.message);
});

module.exports = server;
