DELIMITER //

CREATE PROCEDURE nkfoss.usp_SearchReviews(
	IN pageNum SMALLINT UNSIGNED,
	IN reviewsPerPage TINYINT UNSIGNED,
	IN searchTerm VARCHAR(30)
)
BEGIN

	DROP TEMPORARY TABLE IF EXISTS temp;

	-- Create temporary table for counting and pagination
	SET @searchTerm = searchTerm
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

END //

DELIMITER ;
