# Crypto Scrape

Scrapes price data from coinmarketcap.com and stores the results in a MYSQL db.

## Instructions
Create a MYSQL db

```
CREATE DATABASE `crypto_data`
```

Create a table to hold scraped info

CREATE TABLE `prices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `symbol` varchar(45) NOT NULL,
  `date` datetime NOT NULL,
  `value` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
)

Let er rip

```
node crypto-scrape.js
```
