# Nouveau Vin

Nouveau Vin is an Angular application for browsing professional wine reviews. The back end is comprised of an Express/Node server and MariaDB (MySQL).

## Table of Contents
+ [Introduction](#introduction)
+ [Technologies](#technologies)
+ [Database Setup](#database-setup)
+ [Launch](#launch)

## Introduction

This project was inspired by a similar group project created in Spring 2019. The old project was also an application for browsing wine reviews. It used AngularJS, an earlier version of Express/Node, and MariaDB. It provided some basic querying functionality, with unoptimized sorting and searching, as well as a skeleton for browsing by a single feature. No more functionality was developed after the spring term. 

Nouveau Wine is the realization of our old project's potential. It is rebuilt with newer technology and refined with a deeper understanding of the old (hence my use of the word 'nouveau' - French for 'newly arrived or developed'). Relearning MariaDB was part of recreating the 'old' wine reviews project (it had been over a year since I'd worked with it). I also wanted to try creating another Angular project from scratch with the new things I've learned. 

In addition to polishing up previous knowledge, I also used this project to learn new technologies. The old project did use Express as a backend, but my exposure to it was minimal. My development of the Express server on this project was completely independent of the old project and is the base demonstration of how I understand Express. In addition, I deployed Nouveau Vin on a DigitalOcean droplet (virtual machine) using Nginx as a reverse proxy. This deplyment is currently hosted alongside my portfolio on my personal website (nathankfoss.me) .

## Technologies

- Bootstrap 4
- Angular 2+
- Express 4
- Node 15.2
- MariaDB 10.5

## How to setup database
In this section, I am assuming a couple things before
proceeding. First, you should have a functional install of MariaDB. Second, you should have a MariaDB user with privileges allowing table creation and modification, as well as file uploading. Third, I assume you ARE NOT using some kind of GUI application and are doing everything in the MariaDB console (in the case that you are using a GUI, you should still be able to follow along fine). 

There are a couple things we need to do with the database before we can get started. First, we will create the appropriate table into which we will upload our data. Next, in order to make our queries faster, we will need to create some accessory tables and reformat the first table. Finally, we will create the credentials file so Node can access our database.

### Uploading the data
In order to upload our data, we need a table into which we can load it. The 'wineReviews' table will be our table. (NOTE: Feel free to name any table as you like, but be aware that you must change the query statements in the 'controller.js' file  to reflect your changes.) 

```SQL
CREATE TABLE wineReviews (
	id integer unsigned not null auto_increment primary key, 
	country tinytext, description text, designation tinytext, points smallint unsigned, price tinytext,
	province tinytext, region_1 tinytext, region_2 tinytext, taster_name tinytext, taster_twitter tinytext, 
  title text, variety tinytext, winery tinytext);
```
One thing to notice... the price column is not defined as an integer, but as text. This is because some reviews do not have a price, so they are treated as empty strings. Since we cannot import empty strings into an integer column, we will instead import numbers (and empty string) into a text column. This can be easily converted to a numeric data type later. With our table created, we can deal with the wine-review data. 

**Download the dataset from Kaggle [here](https://www.kaggle.com/zynicide/wine-reviews?select=winemag-data-130k-v2.csv).**

Be sure to download the version 2 csv file (not the json or version 1 csv). Place the file in your database's working directory (on my Windows machine, this is in Program Files/MariaDB 10.5/data/<database_name> ). Ensure that your file is encoded with UTF-8. If you open the file with notepad and 'save as', there should be options for saving with a given encoding. The detected encoding will be selected as default. With our data encoded correctly, we can load it into the table.

```SQL
LOAD DATA INFILE 'wineData.csv' 
INTO TABLE wineReviews 
CHARACTER SET utf8 
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"' 
LINES TERMINATED BY '\n';
```

There's alot going on here, so let's break this statement down:
- **LOAD DATE INFILE 'wineData.csv** ... Load data from the file we placed in the working directory.
- **INTO TABLE wineReviews** ... Put the data in this table (assuming each line from the file will fit into the table's row).
- **CHARACTER SET utf8** ... Declares the encoding of the data. This is important for our data set (accented entries like 'Rosé' won't display properly without this statement).
- **FIELDS TERMINATED BY ','** ... Column values are seperated by commas.
- **OPTIONALLY ENCLOSED BY '"'** ... Sometimes we get text values that INCLUDE commas. Since we don't want these commas to terminated our value prematurely, we indicate that if a comma is enclosed inside of double-quotes, we can ignore it.
- **LINES TERMINATED BY '\n';** ... Each line represents a row in the table.

With our dataset uploaded to the database, there's one more thing we need to do with this table. The 'title' field contains information that is sometimes redundant (it contains the same info as the 'province' column). We are going to overwrite those values using some Regex magic...

```SQL
UPDATE winereviews SET title = REGEXP_SUBSTR(title, '^[^(]* ');
```

Now we can move on to the other tables.

### Accessory tables

When browsing wine reviews, you can choose to browse by categories. Some of these categories are variety, critic, and country (we will use country as an example). There are many countries to browse, but only the database knows them all at any given time. If we want a list of countries to browse, we can get them (and the total entries for each) from the table, but that would take a very long time (the table is huge). Instead we will create a table for each browsing criteria that lists all the values and the number of records for each. Then we will fill these tables with data from the large table.

```SQL
CREATE TABLE countries (
	id integer unsigned not null auto_increment primary key,
	country text,
	numreviews integer unsigned);
	
INSERT INTO countries (country, numreviews) (SELECT country, COUNT(*) FROM winereviews GROUP BY country);
```

This should be done with the remaining browsing criteria. Then we will replace the now-defunct columns in the big table with new id's pointing to the old values.

```SQL
ALTER TABLE winereviews ADD COLUMN (fkCountry integer unsigned not null);
UPDATE winereviews AS w JOIN countries AS c ON w.country = c.country SET w.fkCountry = c.id;
ALTER TABLE winereviews DROP COLUMN country;
```

With seperate tables made for our browsing criteria, we can finally hook the database up to the server.

### Database credentials

Our server needs credentials to access the database. We need to add a JSON file to our 'db' folder (inside the 'server' folder of the repo). This will contain the information we need to access the database. Use this form:

```
{
	"connectionLimit": 10,  // This will depend on your setup. 
	"host": "localhost",
	"user": <your_username_here>,
	"password": <your_password_here>,
	"database": <your_database_here>
}
```

Name the file dbConfig.json (or whatever you'd like if you want to manually change the code).

## Launch
I mentioned earlier that the Angular app is rendered through Express. If you're familiar with the Angular CLI then you may have used 'ng serve' to access your application on local host (port 4200). That application may have accessed a backend via some other port. In this project, you will not use 'ng serve' to access the app. Instead you must build the app (with 'ng build') and run the Express server to render it (with 'node server.js'). To use the app, you will go through local host (port 3000). Express will then either forward appropriate requests to the Angular router, or handle requests to the database. 

