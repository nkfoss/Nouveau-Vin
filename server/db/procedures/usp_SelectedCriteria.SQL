DELIMITER //

CREATE PROCEDURE nkfoss.usp_SelectedCriteria(
	IN pageNum SMALLINT UNSIGNED,
	IN reviewsPerPage TINYINT UNSIGNED,
	IN browsingCriteria VARCHAR(30),
	IN selectedCriteria VARCHAR(30)
)
BEGIN
	-- Construct the select query without the WHERE clause
	SET @stmt = "
	SELECT 
	SQL_CALC_FOUND_ROWS          
	w.points, w.title, w.price,
	w.province, c.country, 
	w.description, t.taster_name, t.taster_twitter
	FROM wineReviews AS w
  	JOIN countries AS c ON w.fkCountry = c.id
  	JOIN tasters AS t ON w.fkTaster = t.id 
	JOIN varieties AS v ON fkvariety = v.id ";
	-- SQL_CALC_FOUND_ROWS is necessary for FOUND_ROWS() to work with a SELECT query.
 
	-- Construct the WHERE clause dependent on browsing criteria, then combine with SELECT stmt
	CASE browsingCriteria 
	WHEN 'countries'
	THEN BEGIN
	SET browsingCriteria = "WHERE c.country = ? ";
	END;

	WHEN 'varieties'
	THEN BEGIN
	SET browsingCriteria = "WHERE v.variety = ? ";
	END;

	ELSE BEGIN	
	SET browsingCriteria = "WHERE t.taster_name = ? ";
	END;
	END CASE;

	-- IMPORTANT: Append the WHERE clause, AND SET collation for the concatenation, otherwise it will fail.
	SET @stmt = CONCAT((CAST(@stmt AS CHAR CHARACTER SET utf8)), CAST(browsingCriteria AS CHAR CHARACTER SET utf8));

	-- Append the LIMIT AND OFFSET clauses
	SET @stmt = CONCAT(@stmt, "LIMIT ? OFFSET ?");

	-- Prepare statement and execute with the provided
	PREPARE stmt FROM @stmt;
	SET @offset = 18 * (pageNum -1);
	EXECUTE stmt USING selectedCriteria, reviewsPerPage, @offset;

	-- Return number of rows (used to calculate max pages for pagination)
	SELECT FOUND_ROWS() as found_rows;


END //

DELIMITER ;
