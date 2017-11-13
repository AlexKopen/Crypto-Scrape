const cheerio = require('cheerio')
const fetchUrl = require('fetch').fetchUrl;
const dateFormat = require('dateformat');
const mysql = require('mysql');
const fs = require('fs');
const lineByLineReader = require('line-by-line');
const con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: ''
});

// Connect to db
con.connect(function(err) {
	if (err) throw err;
	console.log('Connected!');
	gatherData();
});

var totalProcessed = 0;

// Parse through all URLs in currencies.txt
function gatherData() {
	lineReader = new lineByLineReader('currencies.txt');
	const sql = 'INSERT INTO crypto_data.prices (symbol, date, value) VALUES ?';

	lineReader.on('line', function(line) {
		// Fetch HTML from URL
		fetchUrl(line, function(error, meta, body) {
			// Scrape data from table
			if (body === null) return;
			const $ = cheerio.load(body.toString());

			const scrapedSymbol = $('.bold.hidden-xs').text();
			const symbol = scrapedSymbol.substring(1, scrapedSymbol.length - 1).toLowerCase();
			var values = [];

			$('tbody tr').each(function() {
				const date = dateFormat($(':nth-child(1)', this).text(), 'isoDate');
				const value = $(':nth-child(2)', this).text();
				values.push([symbol, date, value]);
			});

			// Insert scraped values into db
			con.query(sql, [values], function(err, result) {
				if (err) throw err;
				console.log('Number of records inserted: ' + result.affectedRows);
				console.log('Finished processing ' + symbol);
				console.log('Total processed: ' + ++totalProcessed);
			});
		});
	});
}

// TODO: Close the SQL connection among completion of all processed lines in currencies.txt
