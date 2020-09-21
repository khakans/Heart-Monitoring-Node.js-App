// EXPREES DAN SOCKET IO
const express = require('express'); // import package express
const app = express(); 
const server = require('http').createServer(app);
const io = require('socket.io').listen(server); // import package socket.io
const path = require('path'); // import package path (sudah default ada)

app.use(express.static(path.join(__dirname,'www'))); // untuk nempation file web kita di folder www
const portListen = 1234;
server.listen(portListen);
console.log("IMEDIC APPLICATION IS RUNNING");
console.log("-------Web Port : "+portListen+"-------");
// /*============================
// =            MQTT            =
// ============================*/
const mqtt = require('mqtt');
const topic1 = 'Imedic/Data1'; //subscribe to all topics
const topic2 = 'Imedic/Data2'; //subscribe to all topics
const broker_server = 'mqtt://broker.hivemq.com';

const options = {
	clientId : 'MyMQTT',
	port : 1883,
	keepalive : 60
}

const clientMqtt = mqtt.connect(broker_server,options);
clientMqtt.on('connect', mqtt_connect);
clientMqtt.on('reconnect', mqtt_reconnect);
clientMqtt.on('error', mqtt_error);
clientMqtt.on('message', mqtt_messageReceived);

function mqtt_connect() {
	clientMqtt.subscribe(topic1);
	clientMqtt.subscribe(topic2);
}

function mqtt_reconnect(err){
	//clientMqtt = mqtt.connect(broker_server, options); // reconnect
}

function mqtt_error(err){
	console.log(err);
}

function after_publish() {
	//call after publish
}
var data1, data2;
function mqtt_messageReceived(topic , message , packet){
	let dataKirim = parsingRAWData(message,",");
	if (topic == 'Imedic/Data1'){
		data1 = dataKirim;
		io.sockets.emit('kirim1', {datasens1 : dataKirim});
	}
	if (topic == 'Imedic/Data2'){
		data2 = dataKirim;
		io.sockets.emit('kirim2', {datasens2 : dataKirim});
	}
	console.log("PPG : " + data1 + " | BPM : " + data2);
}

function parsingRAWData(data,delimiter){
	let result;
	result = data.toString().replace(/(\r\n|\n|\r)/gm,"").split(delimiter);
	return result;
}