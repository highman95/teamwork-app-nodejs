const { Pool } = require('pg');

const db = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.on('connect', () => console.log('Connected to database...'));
db.on('error', (e) => console.error(`Cannot connect to database...${e.message}`));

module.exports = db;
