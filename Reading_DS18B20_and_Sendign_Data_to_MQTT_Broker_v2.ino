#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>


// Define NodeMCU D4 pin to as temperature data pin of  DHT11
#define ONE_WIRE_BUS 2


// Setup a oneWire instance to communicate with any OneWire devices 
// (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);


// Pass our oneWire reference to Dallas Temperature.
DallasTemperature sensors(&oneWire);



// Update these with values suitable for your network.
const char* ssid = "real08";
const char* password = "realmadrid";
//const char* mqtt_server = "broker.mqtt-dashboard.com";
const char* mqtt_server = "iot.eclipse.org";

WiFiClient espClient;
PubSubClient client(espClient);

// Definig variables
long lastMsg = 0;
char msg[50];
int value = 0;

void setup_wifi() {
    delay(100);
  // We start by connecting to a WiFi network
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) 
    {
      delay(500);
      Serial.print(".");
    }
  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}


void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) 
  {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    //if your MQTT broker has clientID,username and password
    //please change following line to    if (client.connect(clientId,userName,passWord))
    if (client.connect(clientId.c_str()))
    {
      Serial.println("connected");
     //once connected to MQTT broker, subscribe command if any
      //client.subscribe("OsoyooCommand");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 6 seconds before retrying
      delay(6000);
    }
  }
} //end reconnect()

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  sensors.begin();  
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  long now = millis();
  // read temperature (ds18b20) sensor every 6 seconds
  if (now - lastMsg > 6000) {
     lastMsg = now;
     
     int data = sensors.getTempCByIndex(0);
     //String msg="";
   
     String msg= msg+ data;
     msg = msg+"C";
     //String msg= data+"C";
     Serial.println(msg);
     
     char message[58];
     msg.toCharArray(message,58);
     
     //publish sensor data to MQTT broker
    client.publish("cattle/temp", message);
  }
}
