const { CronJob } = require('cron');
const MqttService = require('../services/MqttService');
const DataService = require('../services/DataService');
const AlarmService = require('../services/AlarmService');
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

	const alertWatcherJob = new CronJob('* * * * * *', (async () => {
		getLogger('AlarmService Cron').debug('start');
		const service = new AlarmService();
		await service.watchAlert();
		getLogger('AlarmService Cron').debug('end');
	}));

	alertWatcherJob.start();
};

module.exports = {
	setupCronJobs,
};
