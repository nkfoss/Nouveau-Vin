# Nouveau Vin

Nouveau Vin is an Angular application for browsing professional wine reviews. The back end is comprised of an Express/Node server and MariaDB (MySQL).

## Table of Contents
+ [Introduction](#introduction)
+ [Technologies](#technologies)
+ [Setup](#setup)

## Introduction

This project was inspired by a similar group project created in Spring 2019. The old project was also an application for browsing wine reviews. It used AngularJS, an earlier version of Express/Node, and MariaDB. It provided some basic querying functionality, with unoptimized sorting and searching, as well as a skeleton for browsing by a single feature. No more functionality was developed after the spring term. 

Nouveau Wine is the realization of our old project's potential. It is rebuilt with newer technology and refined with a deeper understanding of the old (hence my use of the word 'nouveau' - French for 'newly arrived or developed'). Relearning MariaDB was part of recreating the 'old' wine reviews project (it had been over a year since I'd worked with it). I also wanted to try creating another Angular project from scratch with the new things I've learned. However, I also used this project to learn new technologies. The old project did use Express as a backend, but my exposure to it was minimal. My development of the Express server on this project was completely independent of the old project and is the base demonstration of how I understand Express. In addition, I deployed Nouveau Vin on a DigitalOcean droplet (virtual machine) using Nginx as a reverse proxy. This deplyment is currently hosted alongside my portfolio on my personal website (nathankfoss.me) .

## Technologies

- Bootstrap 4
- Angular 2+
- Express 4
- Node 15.2
- MariaDB 10.5

## Setup

### Setting Up the Database
In this section, I am assuming that you have a functional setup of MariaDB and the appropriate privileges. There are a couple things we need to do with the database before we can get started. First, we will need to create the appropriate table into which we will upload our data. Second, in order to make our queries faster, we will need to create some accessory tables and reformat the first table. Third, we will create the credentials file so Node can access our database.

#### Uploading the Data
In order to upload our data, we need a table into which we load it. The 'wineReviews' table will be our table. (NOTE: Feel free to name any table as you like, but be aware that you must change the query statements in the 'controller.js' file  to reflect your changes.) 

```SQL
CREATE TABLE wineReviews (
	id int, country tinytext, description text, designation tinytext, points smallint unsigned, price tinytext,
	province tinytext, region_1 tinytext, region_2 tinytext, taster_name tinytext, taster_twitter tinytext, 
  title text, variety tinytext, winery tinytext);
```
You may have noticed that the price column is not defined as an integer, but as text. This is because some reviews do not have a price, so they are treated as empty strings. Since we cannot import empty strings into an integer column, we will instead import numbers (and empty string) into a text column. Later on, this can be easily converted to a numeric data type. 

Now we can deal with the wine-review data. The dataset can be downloaded from Kaggle [here](https://www.kaggle.com/zynicide/wine-reviews?select=winemag-data-130k-v2.csv). Be sure to download the version 2 csv file (not the json or version 1 csv). Place the file in your database's working directory (on my Windows machine, this is in Program Files/MariaDB 10.5/data/<database_name>. Ensure that your file is encoded with UTF-8. If you open the file with notepad and 'save as', there should be options for saving with a given encoding. The detected encoding will be selected as default. Now the data can be loaded into the table.

```SQL
LOAD DATA INFILE 'wineData.csv' 
INTO TABLE wineReviews 
CHARACTER SET utf8 
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"' 
LINES TERMINATED BY '\n';
```

Let's break this statement down:
- **LOAD DATE INFILE 'wineData.csv** ... Load data from the file we placed in the working directory.
- **INTO TABLE wineReviews** ... Put the data in this table (assuming each line from the file will fit into the table's row).
- **CHARACTER SET utf8** ... Declares the encoding of the data. This is important for our data set (entries like 'Rosé' won't display properly without this statement).
- **FIELDS TERMINATED BY ','** ... Column values are seperated by commas.
- **OPTIONALLY ENCLOSED BY '"'** ... Sometimes we get text values that INCLUDE commas. Since we don't want these commas to terminated our value prematurely, we indicate that if a comma is enclosed inside of double-quotes, we can ignore it.
- **LINES TERMINATED BY '\n';** ... Each line represents a row in the table.

With our dataset uploaded to the database, we are ready to create the accessory tables.

#### Acessory Tables

### Launch
Mentioned earlier, the Angular app is rendered through Express. If you're familiar with the Angular CLI then you may have used 'ng serve' to access your application on local host (port 4200). That application may have accessed a backend via some other port. In this project, you will not use 'ng serve' to access the app. Instead, you must use 'ng build' and then run the Express server (server.js) to render the app. To use the app, you will go through local host (port 3000). Express will then either forward appropriate requests to the Angular router, or handle requests to the database.

