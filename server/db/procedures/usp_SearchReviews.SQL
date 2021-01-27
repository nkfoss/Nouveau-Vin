DELIMITER //

CREATE PROCEDURE nkfoss.usp_SearchReviews(
	IN pageNum SMALLINT UNSIGNED,
	IN reviewsPerPage TINYINT UNSIGNED,
	IN searchTerm VARCHAR(30)
)
BEGIN
	SET @stmt1 = "
	SELECT 
	SQL_CALC_FOUND_ROWS
	w.points, w.title, w.price, w.province, w.description,
	c.country, t.taster_name, t.taster_twitter 
	FROM wineReviews AS w 
	JOIN countries AS c ON w.fkCountry = c.id 
	JOIN tasters AS t ON w.fkTaster = t.id 
	WHERE MATCH(w.description) AGAINST(?) 
	LIMIT ? OFFSET ?";
	-- SQL_CALC_FOUND_ROWS is necessary for FOUND_ROWS() to work with a SELECT query.

	-- Set offset and execute query to get reviews.
	SET @offset = 18 * (pageNum -1);
	PREPARE stmt1 FROM @stmt1;
	EXECUTE stmt1 USING searchTerm, reviewsPerPage, @offset;

	-- Return number of rows (used to calculate max pages for pagination)
	SELECT FOUND_ROWS() as found_rows;

END //

DELIMITER ;
