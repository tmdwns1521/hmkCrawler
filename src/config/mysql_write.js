
import mysql from 'mysql2/promise';

const mysqlWrite = mysql.createPool({
    host: 'hmkting.synology.me',
    user: 'OSJ',
    password: 'DHtmdwns1521@',
    database: 'OSJ',
    port: 3307,
    multipleStatements: true,
    dateStrings: true,
    connectTimeout: 5000,
    connectionLimit: 100 //default 10
})

export { mysqlWrite };