const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user:process.env.DB_USER,
    password:process.env.PASSWORD,
    database :process.env.DATABASE,
    port: process.env.DB_PORT,
    });
    
    connection.connect((error)=>{
    if(error)throw error;
    console.log("Connection successful");
    });

    module.exports = connection;
