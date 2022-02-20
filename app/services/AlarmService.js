const { exec } = require('child_process');
const logger = require('../logger/logger').getLogger('AlarmService');
const NeptunService = require('./NeptunService');

let lastSentLowbat = false;
let lastSentWirelessAlert = false;
let lastSentWirelessMissed = false;
let lastFirstGroupAlert = false;
let lastSecondGroupAlert = false;

class AlarmService {
	async watchAlert() {
		const nService = new NeptunService();
		const { firstGroupAlert, secondGroupAlert } = await nService.readRegister(0);
		const { alert, missed, lowBat } = await nService.readRegister(57);
		const alerts = [];
		if (lastFirstGroupAlert !== firstGroupAlert) {
			lastFirstGroupAlert = firstGroupAlert;
			const msg = firstGroupAlert ? '`Bath` *leak* alert!!!' : 'Bath leak stopped. Why?..';
			await this.sendTelegram(msg);
			alerts.push(msg);
		}
		if (lastSecondGroupAlert !== secondGroupAlert) {
			lastSecondGroupAlert = secondGroupAlert;
			const msg = secondGroupAlert ? '`Toilet` *leak* alert!!!' : 'Toilet leak stopped. Why?..';
			await this.sendTelegram(msg);
			alerts.push(msg);
		}

		if (lastSentLowbat !== lowBat) {
			lastSentLowbat = lowBat;
			const msg = `Wireless sensor #1 lowBat: ${lowBat}`;
			await this.sendTelegram(msg);
			alerts.push(msg);
		}
		if (lastSentWirelessAlert !== alert) {
			lastSentWirelessAlert = alert;
			const msg = `Wireless sensor #1 lowBat: ${alert}`;
			await this.sendTelegram(msg);
			alerts.push(msg);
		}
		if (lastSentWirelessMissed !== missed) {
			lastSentWirelessMissed = missed;
			const msg = `Wireless sensor #1 missed: ${missed}`;
			await this.sendTelegram(msg);
			alerts.push(msg);
		}

		if (alerts.length === 0) {
			alerts.push('No alerts at this moment');
		}
		return new Promise((resolve) => resolve(alerts.join('\n')));
	}

	async sendTelegram(msg) {
		return new Promise((resolve, reject) => {
			exec(`/opt/telegram/send.sh '${msg}'`, (error, stdout, stderr) => {
				if (error) {
					logger.error(`error: ${error.message}`);
					reject(error.message);
					return;
				}
				if (stderr) {
					logger.error(`stderr: ${stderr}`);
					reject(stderr);
					return;
				}
				logger.info(`stdout: ${stdout}`);
				resolve(stdout);
			});
		});
	}
}
module.exports = AlarmService;
