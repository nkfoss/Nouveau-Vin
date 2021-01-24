DELIMITER //

-- Instead of using select count(*) to COUNT ALL ROW, just do a simple lookup of the table's count.
CREATE FUNCTION f_GetRowCount(tableName VARCHAR(64)) RETURNS BIGINT(21) UNSIGNED
BEGIN
	DECLARE n BIGINT(21);

	SELECT table_rows 
	INTO n
	FROM information_schema.tables as t
	WHERE t.table_name = tableName;

	RETURN n;
END //

DELIMITER ;