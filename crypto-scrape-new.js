const fs = require('fs');
const Currency = require('./currency.factory');
const mysql = require('mysql');
const currencyFile = './test-currencies.txt';
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root'
});

/**
 * MAIN ENTRYPOINT:
 * Creates the database connection and kicks off main.
 */
con.connect(function (err) {
  if (err) throw err;
  console.log('Connected!');

  main();
});

/**
 * Tracks total number of files processed.
 * @type {number}
 */
let totalProcessed = 0;

/**
 * Main does a lot:
 * 1. Grabs the list of files (via a utility method) from the specified path in currencyFile (line 4).
 * 2. Creates an array of factory objects based on the coin data url.
 * 3. Resolves all factories and persists results to the mysql store configured on line 5.
 * 4. Closes the MySQL connection when all paths have been resolved.
 */
function main() {
  "use strict";

  _getArrayOfPathsFromFile(currencyFile).then((currencies) => {
    const currencyResolver = currencies.map((path) => {
      "use strict";
      return new Currency(path).fetchResults().then((currencyData) => {
        // Status for Debugging;
        //_writeStatus(currencyData);

        return _writeToMySQL(currencyData).then((data) => {
          _writeStatus(data);
        });
      });
    });

    Promise.all(currencyResolver).then(() => {
      "use strict";

      console.log('all currencies have been resolved');

      // Close the MySQL Connection.
      con.end();
    });
  });
}

/**
 * Writes currencyData to the MySQL db configured on line 5.
 * @param currencyData
 * @returns {Promise}
 * @private
 */
function _writeToMySQL(currencyData) {
  "use strict";
  const sql = 'INSERT INTO crypto_data.prices (symbol, date, value) VALUES ?';

  return new Promise((resolve, reject) => {
    // Insert scraped values into db
    con.query(sql, [currencyData.values], function (err, result) {
      if (err) reject(err);
      console.log('Number of records inserted: ' + result.affectedRows);
      console.log('Finished processing ' + currencyData.symbol);
      console.log('Total processed: ' + ++totalProcessed);
      resolve(currencyData);
    });
  });
}

/**
 * Writes out some metrics, basically for debugging.
 * @param currencyData
 * @private
 */
function _writeStatus(currencyData) {
  "use strict";
  console.log('symbol', currencyData.scrapedSymbol);
  console.log('count', currencyData.values.length);
}

/**
 * Handles grabbing the array of paths from the external file that is configured on line 4.
 * @param src
 * @returns {Promise}
 * @private
 */
function _getArrayOfPathsFromFile(src) {
  "use strict";

  return new Promise((resolve, reject) => {
    fs.readFile(src, 'UTF8', (err, data) => {
      if (err) reject(err);

      const filePathArray = data.split('\n').filter((item) => {
        return !!item;
      });

      resolve(filePathArray);
    });
  });
}
