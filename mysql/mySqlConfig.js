const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'rini',
  password: 'Password@123',
  port: 3306,
  database: 'bot',
});

connection.connect((err) => {
  if (err) throw err;
  else {
    console.log('DB connected');
  }
});

module.exports = connection;
