var mysql = require('mysql');

//Create Connection
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "mydb"
});


connection.connect(function(err) {
	if (err) throw err;
	console.log("Database Connected!");
});


//insert a row into the tbl_messages table
connection.connect(function(err) {
	var cattleID= "cattle001";
	var topic = "cattle/temp";
	var message = "50";
	var sql = "INSERT INTO ?? (??,??,??) VALUES (?,?,?)";
	var params = ['tbl_messages', 'cattleID', 'topic', 'message', cattleID, topic, message];
	sql = mysql.format(sql, params);	
	connection.query(sql, function (error, results) {
		if (error) throw error;
		console.log("1 record inserted");
	});
});		