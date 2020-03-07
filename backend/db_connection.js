const mysql = require('mysql2');

// create the connection to database
var connection = mysql.createPool({
    connectionLimit: 10,
    host: 'handshake.chf9uwuchcb3.us-east-1.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'admin#123',
    database: 'handshake',
    dateStrings: true
});
// const sequelizeconnection = new sequelize('handshake', 'admin', 'admin#123', {
//     host: 'handshake.chf9uwuchcb3.us-east-1.rds.amazonaws.com',
//     dialect: 'mysql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
//   });

// var connection = mysql.createPool({
    // connectionLimit: 10,
    // host: 'localhost',
    // port: '3306',
    // user: 'root',
    // password: 'Ccompiler7!',
    // database: 'grubhub',
    // dateStrings: true
// });
connection.query("SET FOREIGN_KEY_CHECKS=0", (err, res)=> {
    if(err) console.log("DB connection failed!!!");
    else {
        console.log("DB connection successful!!!");
    } 
});
module.exports = connection;