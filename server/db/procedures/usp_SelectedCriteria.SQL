DELIMITER //

CREATE PROCEDURE usp_SelectedCriteria(
	IN pageNum SMALLINT UNSIGNED,
	IN reviewsPerPage TINYINT UNSIGNED,
	IN browsingCriteria VARCHAR(30),
	IN selectedCriteria VARCHAR(30)
)
BEGIN

	DROP TEMPORARY TABLE IF EXISTS temp;

	-- Create temporary table 
	SET @stmt = "
	CREATE TEMPORARY TABLE IF NOT EXISTS
	temp 
	CHARACTER SET utf8 COLLATE utf8_general_ci
	AS
	SELECT w.points, w.title, w.price,
	w.province, c.country, 
	w.description, t.taster_name, t.taster_twitter
	FROM wineReviews AS w
  	JOIN countries AS c ON w.fkCountry = c.id
  	JOIN tasters AS t ON w.fkTaster = t.id 
	JOIN varieties AS v ON fkvariety = v.id ";
 
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

	SET collation_connection = 'utf8_general_ci';
	SET @stmt = CONCAT(@stmt, browsingCriteria);

	PREPARE stmt FROM @stmt;
	set @selectedCriteria = selectedCriteria;
	EXECUTE stmt USING selectedCriteria;

	-- Now return the page number requested.
	SET @offset = 18 * (pageNum -1);
	SET @stmt2 = CONCAT( "SELECT * FROM temp LIMIT ? OFFSET ?");
	PREPARE stmt2 FROM @stmt2;
	EXECUTE stmt2 USING reviewsPerPage, @offset;

END //

DELIMITER ;
