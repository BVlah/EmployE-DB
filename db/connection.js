const mysql = require('mysql2')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Bootc@mp5',
    database: 'employe_db'
});

module.exports = db;
