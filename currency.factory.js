const fs = require('fs');
const cheerio = require('cheerio');
const dateFormat = require('dateformat');
const fetchUrl = require('fetch').fetchUrl;

/**
 * Currency is a factory class that encapsulates scraping to the
 * context of the target path defined in the constructor.
 */
class Currency {

    /**
	 * Currency is a factory class that encapsulates scraping to the
     * context of the target path defined in the constructor.
     * @param path: Local file path or coinmarketcap URL.
     */
	constructor(path) {
		this._path = path;
	}

    /**
	 * Main return method.
     * @returns {*}
     */
	fetchResults() {
		if (this._isLocal()) {
			return this._scrapeLocal();
		} else {
			return this._scrapeUrl();
		}
	}

    /**
     * Scrapes and returns pricing data from a local html file.
     * @returns {Promise}: Resolved promise contains scraped results.
     * @private
     */
	_scrapeLocal() {
		return new Promise((resolve, reject) => {
            fs.readFile(this._path, 'UTF8', (err, body) => {
            	if (err) reject(err);

                const currencyData = this._scrapeFromSource(true, body);

                resolve(currencyData);
			});
		});
	}

    /**
	 * Scrapes and returns pricing data from a coinmarketcap.com URL.
     * @returns {Promise}: Resolved promise contains scraped results.
     * @private
     */
	_scrapeUrl() {
		return new Promise((resolve, reject) => {

			fetchUrl(this._path, (err, meta, body) => {
				// Reject on error
            	if (err) reject(err);

            	// Reject if body is null;
            	if (body === null) reject(new Error(`${this._path} returns a null body`));

            	const currencyData = this._scrapeFromSource(false, body);

                resolve(currencyData);
			});
		});
	}

    /**
	 * Utility method that scrapes the DOM with cheerio.
     * @param isLocal: Set to true if path is local.
     * @param body: HTML document body data.
     * @returns {{scrapedSymbol: (*|XMLList|jQuery), symbol: string, values: Array}}
     * @private
     */
	_scrapeFromSource(isLocal, body) {
        const $ = isLocal ? cheerio.load(body) : cheerio.load(body.toString());

        const scrapedSymbol = $('.bold.hidden-xs').text();
        const symbol = scrapedSymbol.substring(1, scrapedSymbol.length - 1).toLowerCase();
        let values = [];

        $('tbody tr').each(function() {
            const date = dateFormat($(':nth-child(1)', this).text(), 'isoDate');
            const value = $(':nth-child(2)', this).text();
            values.push([symbol, date, value]);
        });

        const currencyData = { scrapedSymbol: scrapedSymbol, symbol: symbol, values: values };

        return currencyData;
	}

    /**
	 * Utility method returns true if the path passed into the constructor is
	 * a local file.
     * @returns {boolean}: True if file path is local.
     * @private
     */
	_isLocal() {
		const path = this._path.substring(0, 4);
		return path !== 'http';
	}
}

module.exports = Currency;