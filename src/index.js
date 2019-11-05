require('dotenv').config();

const http = require('http');
const app = require('./app');

let server = http.createServer(app);
server = server.listen(process.env.PORT || 3000, (error) => {
    console.log(error ? `Error: ${error}...` : `Listening on PORT: ${server.address().port}`);
});

module.exports = server;
