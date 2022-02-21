const MQTT = require('async-mqtt');
const NeptunService = require('./NeptunService');
const logger = require('../logger/logger').getLogger('MqttService');

const deviceName = 'NeptunSmartProxy';
const mqttDeviceCfg = {
	identifiers: [
		deviceName,
	],
	name: 'Neptun Smart module proxy',
	model: 'NSMMP-1',
	manufacturer: 'Me',
};

// const mqttRootTopic = `homeassistant/sensor/${deviceName}`;

const getAvailTopicDefinition = (device) => {
	const root = `homeassistant/sensor/${device}`;
	const name = `${root}/availability`;
	const cfgName = `${name}/config`;
	const cfg = JSON.stringify({
		name: `${device}_availability`,
		unique_id: `${device}_availability`,
		state_topic: `${root}/availability`,
		device: mqttDeviceCfg,
	});
	return { name, cfgName, cfg };
};
const getTopicDefinition = (topicName, device) => {
	const root = `homeassistant/sensor/${device}`;
	const name = `${root}/${topicName}`;
	const cfgName = `${name}/config`;
	const cfg = JSON.stringify({
		name: `${device}_${topicName}`,
		unique_id: `${device}_${topicName}`,
		state_topic: `${root}/${topicName}`,
		availability_topic: `${root}/availability`,
		device: mqttDeviceCfg,
		unit_of_measurement: 'm³',
		device_class: 'gas',
	});
	return { name, cfgName, cfg };
};

const availTopic = getAvailTopicDefinition(deviceName);
const bathHotWaterMeterTopic = getTopicDefinition('bathHotWaterMeter', deviceName);
const bathColdWaterMeterTopic = getTopicDefinition('bathColdWaterMeter', deviceName);
const toiletHotWaterMeterTopic = getTopicDefinition('toiletHotWaterMeter', deviceName);
const toiletColdWaterMeterTopic = getTopicDefinition('toiletColdWaterMeter', deviceName);

class MqttService {
	async getClient() {
		if (!this.constructor.client) {
			const {
				MQTT_IP: mqttIp,
			} = process.env;

			const options = {
				will: {
					topic: availTopic.name,
					payload: 'offline',
					qos: 2,
					retain: true,
				},
			};
			try {
				this.constructor.client = await MQTT.connectAsync(`tcp://${mqttIp}:1883`, options);
			} catch (e) {
				logger.error('Unable to connect to the MQTT broker');
				logger.error(e);
				return undefined;
			}

			const { client } = this.constructor;

			try {
				await client.publish(
					availTopic.cfgName, availTopic.cfg, { qos: 2, retain: true },
				);

				await client.publish(
					bathHotWaterMeterTopic.cfgName, bathHotWaterMeterTopic.cfg, { qos: 1, retain: true },
				);

				await client.publish(
					bathColdWaterMeterTopic.cfgName, bathColdWaterMeterTopic.cfg, { qos: 1, retain: true },
				);

				await client.publish(
					toiletHotWaterMeterTopic.cfgName, toiletHotWaterMeterTopic.cfg, { qos: 1, retain: true },
				);

				await client.publish(
					toiletColdWaterMeterTopic.cfgName, toiletColdWaterMeterTopic.cfg, { qos: 1, retain: true },
				);

				await client.publish(
					availTopic.name, 'online', { qos: 2, retain: true },
				);
			} catch (e) {
				logger.error('Unable to publish configuration after connect');
				logger.error(e);
				return undefined;
			}
		} else if (!this.constructor.client.connected) {
			this.constructor.client.reconnect();
		}
		return this.constructor.client;
	}

	async sendMqttMessages() {
		const client = await this.getClient();
		if (!client) {
			logger.error('Client is not returned. Check errors above.');
			return;
		}

		let bathHotReg;
		let bathColdReg;
		let toiletHotReg;
		let toiletColdReg;
		const neptunService = new NeptunService();
		try {
			bathHotReg = await neptunService.readRegister(115);
		} catch (e) {
			logger.error('Unable to read register 0115');
			logger.error(e);
		}
		try {
			bathColdReg = await neptunService.readRegister(117);
		} catch (e) {
			logger.error('Unable to read register 0117');
			logger.error(e);
		}
		try {
			toiletHotReg = await neptunService.readRegister(119);
		} catch (e) {
			logger.error('Unable to read register 0119');
			logger.error(e);
		}
		try {
			toiletColdReg = await neptunService.readRegister(121);
		} catch (e) {
			logger.error('Unable to read register 0121');
			logger.error(e);
		}

		if (bathHotReg && bathColdReg && toiletHotReg && toiletColdReg) {
			try {
				await client.publish(
					bathHotWaterMeterTopic.name, `${bathHotReg.data.value / 1000}`, { qos: 1, retain: true },
				);

				await client.publish(
					bathColdWaterMeterTopic.name, `${bathColdReg.data.value / 1000}`, { qos: 1, retain: true },
				);

				await client.publish(
					toiletHotWaterMeterTopic.name, `${toiletHotReg.data.value / 1000}`, { qos: 1, retain: true },
				);

				await client.publish(
					toiletColdWaterMeterTopic.name, `${toiletColdReg.data.value / 1000}`, { qos: 1, retain: true },
				);
			} catch (e) {
				logger.error('Unable to publish the MQTT data');
				logger.error(e);
			}
		}
	}
}

module.exports = MqttService;
