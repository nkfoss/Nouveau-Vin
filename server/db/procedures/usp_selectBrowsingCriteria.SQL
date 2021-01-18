DELIMITER //

CREATE PROCEDURE usp_SelectBrowsingCriteria(
	IN criteria VARCHAR(50)
)
BEGIN
	CASE criteria
		WHEN 'countries' THEN SELECT country as value, numReviews from countries;
		WHEN 'varieties' THEN SELECT variety as value, numReviews from varieties;
		ELSE SELECT taster_name AS value, numReviews from tasters;
	END CASE;
END//

DELIMITER ;

