import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sheha293',
    database: 'exp_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
// console.log('Database Configuration:', {
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE,
// });
//
// const pool = mysql.createPool({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
// });

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Database connected as id ' + connection.threadId);
    connection.release(); // Release the connection back to the pool
});

export default pool.promise(); // Export the promise-based pool
//