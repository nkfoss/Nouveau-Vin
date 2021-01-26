This log is used for documenting performance improvements for updated procedures/functions. The format is self explanatory.

### Search Implementation *(Issue #30)*

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


