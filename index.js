const speedTest = require('speedtest-net');
const test = speedTest({maxTime: 60000});
const mqtt = require('mqtt');

const {url, credentials, topic} = require('./config/mqtt');
const client = mqtt.connect(url, credentials);

client.on('connect', function() {
	console.log('connected to MQTT server');

  test.on('data', data => {
    const client = mqtt.connect(url, credentials);

    console.log('down: ', data.speeds.download, 'up: ', data.speeds.upload);

    const upstreamTopic = `${topic}/bandwidth/upstream`;
  	const downstreamTopic = `${topic}/bandwidth/downstream`;

    client.publish(upstreamTopic, data.speeds.download);
    client.publish(downstreamTopic, data.speeds.upload);
  });

  test.on('error', console.error);
});

client.on('error', console.error);
