const { CronJob } = require('cron');
const MqttService = require('../services/MqttService');
const { getLogger } = require('../logger/logger');

const setupCronJobs = () => {
	const job = new CronJob('0 */10 * * * *', (async () => {
		getLogger('MqttService Cron').debug('start');
		const mqttService = new MqttService();
		await mqttService.sendMqttMessages();
		getLogger('MqttService Cron').debug('end');
	}));

	job.start();
};

module.exports = {
	setupCronJobs,
};
