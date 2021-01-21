DELIMITER //

CREATE PROCEDURE usp_selectRandoms()
BEGIN
	-- Get the total number of reviews
	DECLARE n MEDIUMINT UNSIGNED;
	SELECT count(*) INTO n from wineReviews;

	-- The idList is a string of concatenated ID's to be prepared in a stmt
	SET @idList = '(';

	-- The loop will calculate a random id, then concat into idList. Later, this will be prepared stmt.
	set @randId = 0;
	set @count = 0;
	WHILE @count < 19 DO
		SELECT FLOOR( RAND() * n) INTO @randId;
		SELECT CONCAT( @idList, @randId, ', ') INTO @idList;
		SET @count = @count + 1;
	END WHILE;
	SELECT REGEXP_REPLACE(@idList, ', $', ')') INTO @idList;

	-- Prepare stmt from idList
	set @stmt = 'SELECT w.points, w.title, w.price,
	w.province, c.country, 
	w.description, t.taster_name, t.taster_twitter
	FROM wineReviews AS w
  	JOIN countries AS c ON w.fkCountry = c.id
  	JOIN tasters AS t ON w.fkTaster = t.id 
	WHERE w.id IN ';
	set @stmt = CONCAT(@stmt, @idList, ';');

	PREPARE stmt from @stmt;
	EXECUTE stmt;

END

//

DELIMITER ;
