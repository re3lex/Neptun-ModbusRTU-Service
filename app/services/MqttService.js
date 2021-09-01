/* eslint-disable no-console */
const MQTT = require('async-mqtt');
const NeptunService = require('./NeptunService');

const deviceName = 'NeptunSmartProxy';
const mqttDeviceCfg = {
	identifiers: [
		deviceName,
	],
	name: 'Neptun Smart module proxy',
	model: 'NSMMP-1',
	manufacturer: 'Me',
};

const mqttRootTopic = `homeassistant/sensor/${deviceName}`;

const availTopicName = `${mqttRootTopic}/availability`;
const availTopicCfgName = `${availTopicName}/config`;
const availTopicCfg = JSON.stringify({
	name: `${deviceName}_availability`,
	unique_id: `${deviceName}_availability`,
	state_topic: availTopicName,
	device: mqttDeviceCfg,
});

const bathHotWaterMeterTopicName = `${mqttRootTopic}/bathHotWaterMeter`;
const bathHotWaterMeterTopicCfgName = `${bathHotWaterMeterTopicName}/config`;
const bathHotWaterMeterTopicCfg = JSON.stringify({
	name: `${deviceName}_bathHotWaterMeter`,
	unique_id: `${deviceName}_bathHotWaterMeter`,
	state_topic: bathHotWaterMeterTopicName,
	device: mqttDeviceCfg,
});

const bathColdWaterMeterTopicName = `${mqttRootTopic}/bathColdWaterMeter`;
const bathColdWaterMeterTopicCfgName = `${bathColdWaterMeterTopicName}/config`;
const bathColdWaterMeterTopicCfg = JSON.stringify({
	name: `${deviceName}_bathColdWaterMeter`,
	unique_id: `${deviceName}_bathColdWaterMeter`,
	state_topic: bathColdWaterMeterTopicName,
	device: mqttDeviceCfg,
});

class MqttService {
	async getClient() {
		if (!this.constructor.client) {
			const {
				MQTT_IP: mqttIp,
			} = process.env;

			const options = {
				will: {
					topic: availTopicName,
					payload: 'offline',
					qos: 2,
					retain: true,
				},
			};
			try {
				this.constructor.client = await MQTT.connectAsync(`tcp://${mqttIp}:1883`, options);
			} catch (e) {
				console.error('Unable to connect to the MQTT broker', e);
				return undefined;
			}

			const { client } = this.constructor;

			try {
				await client.publish(
					availTopicCfgName, availTopicCfg, { qos: 2, retain: true },
				);

				await client.publish(
					bathHotWaterMeterTopicCfgName, bathHotWaterMeterTopicCfg, { qos: 1, retain: true },
				);

				await client.publish(
					bathColdWaterMeterTopicCfgName, bathColdWaterMeterTopicCfg, { qos: 1, retain: true },
				);

				await client.publish(
					availTopicName, 'online', { qos: 2, retain: true },
				);
			} catch (e) {
				console.error('Unable to publish configuration after connect', e);
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
			console.error('Client is not returned. Check errors above.');
			return;
		}

		const neptunService = new NeptunService();
		const bathHotReg = await neptunService.readRegister(115);
		const bathColdReg = await neptunService.readRegister(117);
		const toiletHotReg = await neptunService.readRegister(119);
		const toiletColdReg = await neptunService.readRegister(121);

		try {
			await client.publish(
				bathHotWaterMeterTopicName, `${bathHotReg.data.value / 1000}`, { qos: 1, retain: true },
			);

			await client.publish(
				bathColdWaterMeterTopicName, `${bathColdReg.data.value / 1000}`, { qos: 1, retain: true },
			);
		} catch (e) {
			console.error('Unable to publish the MQTT data', e);
		}
	}
}

module.exports = MqttService;
