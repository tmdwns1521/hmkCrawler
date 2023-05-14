import mysql from 'mysql2/promise';

const mysqlRead = mysql.createPool({
    host: 'hmkting.synology.me',
    user: 'OSJ',
    password: 'DHtmdwns1521@',
    database: 'OSJ',
    port: 3307,
    dateStrings: true,
    connectTimeout: 5000,
    connectionLimit: 180 //default 10
})

export { mysqlRead };