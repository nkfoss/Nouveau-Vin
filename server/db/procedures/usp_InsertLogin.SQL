DELIMITER //

CREATE PROCEDURE nkfoss.usp_InsertLogin(
	IN ip VARCHAR(40),
	IN username VARCHAR(50),
	IN pass VARCHAR(50)
)
BEGIN
	INSERT INTO logins VALUES (ip, NOW(6), username, pass);
END //

DELIMITER ;

