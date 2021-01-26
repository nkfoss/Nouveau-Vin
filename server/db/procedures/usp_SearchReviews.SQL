DELIMITER //

CREATE PROCEDURE nkfoss.usp_SearchReviews(
	IN pageNum SMALLINT UNSIGNED,
	IN reviewsPerPage TINYINT UNSIGNED,
	IN searchTerm VARCHAR(30)
)
BEGIN
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

END //

DELIMITER ;
