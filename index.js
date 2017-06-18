const mqtt = require('mqtt');
const speedTest = require('speedtest-net');

const {url, credentials, topic} = require('./config/mqtt');

console.log('Starting speedtest.');
const test = speedTest({maxTime: 60000});

test.on('data', data => {
  console.log('Completed speedtest.');

  console.log('Connecting to MQTT server.');
	const client = mqtt.connect(url, credentials);

	client.on('connect', function() {
		console.log('Connected to MQTT server');

		const upstreamTopic = `${topic}/bandwidth/upstream`;
		const downstreamTopic = `${topic}/bandwidth/downstream`;

    console.log('Publishing measurements.');
    console.log(`  ${downstreamTopic} › ${data.speeds.download}`);
    console.log(`  ${upstreamTopic} › ${data.speeds.upload}`);

	  client.publish(downstreamTopic, `${data.speeds.download}`);
    client.publish(upstreamTopic, `${data.speeds.upload}`);

    console.log('Disconnecting from MQTT server.');
		client.end();
	});

	client.on('close', () => {
    console.log('Disconnected from MQTT server.');
    process.exit(1);
  });

	client.on('error', error => {
    console.error('MQTT error:', error);
    process.exit(0);
  });

});

test.on('error', error => {
  console.error('Speedtest error:', error);
  process.exit(0);
});
