const mysql = require('mysql');
const fs = require('fs');
const csv = require('csv-parser');

const mysqlConfig = {
  host: '127.0.0.1',
  user: 'username',
  password: 'your-database-pwd',
  database: 'your-database-name',
  port: 3306, 
};

function insertOrUpdateData(connection, data) {
    const query = 'INSERT INTO cmb_can (id, name_id, variable, departure, arrival, time, airport_dep, airport_arri, selection) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id = VALUES(id), name_id = VALUES(name_id), variable = VALUES(variable), departure = VALUES(departure), arrival = VALUES(arrival), time = VALUES(time), airport_dep = VALUES(airport_dep), airport_arri = VALUES(airport_arri), selection = VALUES(selection)';
  
    connection.query(query, [data.id, data.name_id, data.variable, data.departure, data.arrival, data.time, data.airport_dep, data.airport_arri, data.selection], (error, results, fields) => {
        if (error) {
        console.error(error.message);
      }
    });
  }

const connection = mysql.createConnection(mysqlConfig);

connection.connect((err) => {
  if (err) {
    console.error(err.message);
    return;
  }

//    fs.createReadStream('your_csv_file.csv')
//     .pipe(csv())
//     .on('data', (row) => {
//       // Assuming your CSV file has columns named 'column1' and 'column2'
//       insertDataToMysql(connection, row);
//     })
//     .on('end', () => {
//       // Close the MySQL connection after processing the CSV
//       connection.end();
//     });

  fs.watchFile('CMB-CAN.csv', (curr, prev) => {
    console.log('File has been updated.');

    fs.createReadStream('CMB-CAN.csv')
      .pipe(csv())
      .on('data', (row) => {
        insertOrUpdateData(connection, row);
      })
      .on('end', () => {
        console.log('Data has been updated in the database.');
      });
  });
});
