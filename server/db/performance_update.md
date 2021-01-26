This log is used for documenting performance improvements for updated procedures/functions. Newest improvements are at the top. 

The number of trials performed is always 42 (unless stated otherwise).

## Pagination/temporary table *(Issue #32)*

This improvement involves two procedures that I will document seperately within this section.

#### Procedure: usp_SearchReviews

Original content:
```SQL
DROP TEMPORARY TABLE IF EXISTS temp;

-- Create temporary table for counting and pagination
SET @searchTerm = searchTerm;
SET @stmt1 = "
CREATE TEMPORARY TABLE IF NOT EXISTS
temp AS 
SELECT w.points, w.title, w.price, w.province, w.description,
c.country, t.taster_name, t.taster_twitter 
FROM wineReviews AS w 
JOIN countries AS c ON w.fkCountry = c.id 
JOIN tasters AS t ON w.fkTaster = t.id 
WHERE MATCH(w.description) AGAINST(?)";
PREPARE stmt1 from @stmt1;
EXECUTE stmt1 USING @searchTerm;

-- Now return the page number requested.
SET @offset = 18 * (pageNum -1);
SET @stmt2 = CONCAT( "SELECT * FROM temp LIMIT ? OFFSET ?");
PREPARE stmt2 FROM @stmt2;
EXECUTE stmt2 USING reviewsPerPage, @offset;

```

Updated:
```SQL
SET @stmt1 = "
SELECT w.points, w.title, w.price, w.province, w.description,
c.country, t.taster_name, t.taster_twitter 
FROM wineReviews AS w 
JOIN countries AS c ON w.fkCountry = c.id 
JOIN tasters AS t ON w.fkTaster = t.id 
WHERE MATCH(w.description) AGAINST(?) 
LIMIT ? OFFSET ?;
";

SET @offset = 18 * (pageNum -1);
PREPARE stmt1 FROM @stmt1;
EXECUTE stmt1 USING searchTerm, reviewsPerPage, @offset;
```

Results: Execution times are in seconds, for the corresponding implementations and search terms.

|  Statement          | 'oak'       | 'elegant'   |'crisp'|
| -------------       | ------------- | -----          |----     |
| *CREATE TEMPORARY..*  | 0.235       | 0.087        | 0.189   |
| *(no temp table)*      | 0.019       | 0.006        |0.015|
|--- |---- |--- |---
| **Execution time change:**|-91.9% | -93.1% | -92.1%

-------------------------------------

#### Procedure: usp_SelectedCriteria
#####(Countries)

|  Statement          | 'France'       | 'India'   |'Moldova'|
| -------------       | ------------- | -----          |----     |
| *CREATE TEMPORARY..*  | 0.825       | 0.715        | 0.713   |
| *(no temp table)*      | 0.009       | 0.570        |0.176|
|--- |---- |--- |---
| **Execution time change:**|-98.9% | -20.3% | -75.3%

#####(Varieties)

|  Statement          | 'Pinot Grigio'       | 'Apple'   |'Blauer Portugieser'|
| -------------       | ------------- | -----          |----     |
| *CREATE TEMPORARY..*  | 0.754       | 0.694        | 0.850   |
| *(no temp table)*      | 0.007       | 0.589        |0.594|
|--- |---- |--- |---
| **Execution time change:**|-99.1% | -15.1% | -30.1%
#####(Tasters)
  Statement          | 'Anne Krebiehl MW'       | 'Matt Kettman'   |'Paul Gregutt'|
| -------------       | ------------- | -----          |----     |
| *CREATE TEMPORARY..*  | 0.046       |  0.080      | 0.112   |
| *(no temp table)*      | 0.001       |  0.001      | 0.001 |
|--- |---- |--- |---
| **Execution time change:**|-97.8% | -98.8% | -99.1%




## Search Implementation *(Issue #30)*

The search procedure was updated to take advantage of a full-text index.

Original content:
```SQL
SET @searchTerm = CONCAT('%', searchTerm, '%');
SET @stmt1 = "
CREATE TEMPORARY TABLE IF NOT EXISTS temp AS 
SELECT w.points, w.title, w.price, w.province, w.description,
	c.country, t.taster_name, t.taster_twitter 
FROM wineReviews AS w 
JOIN countries AS c ON w.fkCountry = c.id 
JOIN tasters AS t ON w.fkTaster = t.id 
WHERE w.description LIKE ?";
	
PREPARE stmt1 from @stmt1;
EXECUTE stmt1 USING @searchTerm;
```

Updated:
```SQL
-- Mostly same as above, except...
SET @searchTerm = searchTerm;
SET @stmt1 = " ... WHERE MATCH(w.description) AGAINST(?);"
```

The results are shown below. Each column shows execution times (in seconds) of the procedure using a given search term. The search terms are chosen randomly from a list of common words found in the review descriptions. Each search is run 42 times.



|  Statement          | 'lemon'       | 'undertones'   |'acidity'|
| -------------       | ------------- | -----          |----     |
| *MATCH ... AGAINST(x)*  | 0.140       | 0.007        | 0.463   |
| *WHERE ... LIKE '%x%'*      | 0.799       | 0.732        |0.968|
|--- |---- |--- |---
| **Execution time change:**|-82.5% | -99.0% | -52.2%


