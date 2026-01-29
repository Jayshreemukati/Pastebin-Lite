require("dotenv").config();
const mysql = require("mysql2/promise");

console.log(process.env, "process.env")
const db = mysql.createPool({

  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: "Concept@cispl#123",
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = db;


