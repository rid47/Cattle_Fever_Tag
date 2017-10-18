var mqtt = require('mqtt');
var Topic = 'sensors/test/temperature'; 
var Broker_URL = 'mqtt://iot.eclipse.org';


/*var options = {
	cattleID: 'MyMQTT',
	port: 1883,
	//username: 'mqtt_user',
	//password: 'mqtt_password',	
	keepalive : 60
};*/

var client  = mqtt.connect(Broker_URL);
client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);

function mqtt_connect() {
    console.log("Connecting MQTT");
    client.subscribe(Topic, mqtt_subscribe);
}

function mqtt_subscribe(err, granted) {
    console.log("Subscribed to " + Topic);
    if (err) {console.log(err);}
}

function mqtt_reconnect(err) {
    console.log("Reconnect MQTT");
    if (err) {console.log(err);}
	client  = mqtt.connect(Broker_URL);
}

function mqtt_error(err) {
    console.log("Error!");
	if (err) {console.log(err);}
}

function after_publish() {
	//do nothing
}

function mqtt_messsageReceived(topic, message, packet) {
	console.log('Message received = ' + message);
	insert_message(topic, message, packet);
}

function mqtt_close() {
	console.log("Close MQTT");
}

////////////////////////////////////////////////////
///////////////////// MYSQL ////////////////////////
////////////////////////////////////////////////////
var mysql = require('mysql');

//Create Connection
var connection = mysql.createConnection({
	host: 'localhost',
	user: "root",
	password: "",
	database: "ecattle"
});

connection.connect(function(err) {
	if (err) throw err;
	console.log("Database Connected!");
});

//insert a row into the temperature_data table
function insert_message(topic, message, packet) {
	var message= message + '';
	var arr=message.split(",");
	var cattleID= arr[0];
	var temperature= arr[1];
	console.log(arr[0]);
	console.log(arr[1]);
	var sql = "INSERT INTO ?? (??,??) VALUES (?,?)";
	var params = ['temperature_data', 'id', 'temperature', cattleID,temperature];
	sql = mysql.format(sql, params);	
	connection.query(sql, function (error, results) {
		if (error) throw error;
		console.log("1 record inserted");
	});
};	
