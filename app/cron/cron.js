const { CronJob } = require('cron');
const MqttService = require('../services/MqttService');
const DataService = require('../services/DataService');
const { getLogger } = require('../logger/logger');

const setupCronJobs = () => {
	const mqttJob = new CronJob('0 */10 * * * *', (async () => {
		getLogger('MqttService Cron').debug('start');
		const mqttService = new MqttService();
		await mqttService.sendMqttMessages();
		getLogger('MqttService Cron').debug('end');
	}), null, false, undefined, undefined, true);

	mqttJob.start();

	const sendDataJob = new CronJob('30 */30 * * * *', (async () => {
		getLogger('DataService Cron').debug('start');
		const service = new DataService();
		await service.sendData();
		getLogger('DataService Cron').debug('end');
	}));

	sendDataJob.start();
};

module.exports = {
	setupCronJobs,
};
