const speedTest = require('speedtest-net');
const test = speedTest({maxTime: 5000});
const mqtt = require('mqtt');

const {url, credentials, topic} = require('./config/mqtt');
const client = mqtt.connect(url, credentials);

client.on('connect', function() {
	console.log('connected to MQTT server');

// run speed test

	const topic = 'topic';
  client.publish(topic, "value");
});

client.on('error', console.error);
