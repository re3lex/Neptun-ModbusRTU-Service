const { CronJob } = require('cron');
const MqttService = require('../services/MqttService');

const setupCronJobs = () => {
	const job = new CronJob('0 */10 * * * *', (() => {
		const mqttService = new MqttService();
		mqttService.sendMqttMessages();
	}));

	job.start();
};

module.exports = {
	setupCronJobs,
};
