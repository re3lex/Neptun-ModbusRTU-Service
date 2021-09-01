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

const getTopicDefinition = (topicName, device) => {
	const root = `homeassistant/sensor/${device}`;
	const name = `${root}/${topicName}`;
	const cfgName = `${name}/config`;
	const cfg = JSON.stringify({
		name: `${device}_${topicName}`,
		unique_id: `${device}_${topicName}`,
		state_topic: topicName,
		device: mqttDeviceCfg,
	});
	return { name, cfgName, cfg };
};

const availTopic = getTopicDefinition('availability', deviceName);
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
				logger.error('Unable to connect to the MQTT broker', e);
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
				logger.error('Unable to publish configuration after connect', e);
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

		const neptunService = new NeptunService();
		const bathHotReg = await neptunService.readRegister(115);
		const bathColdReg = await neptunService.readRegister(117);
		const toiletHotReg = await neptunService.readRegister(119);
		const toiletColdReg = await neptunService.readRegister(121);

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
			logger.error('Unable to publish the MQTT data', e);
		}
	}
}

module.exports = MqttService;
