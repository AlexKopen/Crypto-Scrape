# Crypto Scrape

Scrapes price data from coinmarketcap.com and stores the results in a MYSQL db

## Instructions
Create a MYSQL db

```
CREATE DATABASE `crypto_data`
```

Create a table to hold scraped info

```
CREATE TABLE `prices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `symbol` varchar(45) NOT NULL,
  `date` datetime NOT NULL,
  `value` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
)
```

Get them young dependencies

```
npm install
```

Let er rip

```
npm start
```

## Docker Compose File Notes

If you decide to use the Dockerfile for a development database, you need to install the latest version of docker and docker compose:
https://docs.docker.com/compose/install/

After installation, browse to the root directory of this project (where the docker-compose.yml file is located) and run: `docker-compose up -d`. You may need to run `sudo docker-compose up -d` depending on your system setup. To view your new docker mysql db `docker ps`. If your database is no longer running, you can find all of your docker containers with `docker ps -a`.