const { exec } = require('child_process');
const logger = require('../logger/logger').getLogger('AlarmService');
const NeptunService = require('./NeptunService');

class AlarmService {
	async sendAlert() {
		const nService = new NeptunService();
		const wireSensor = await nService.readRegister(0);
		const wirelesSensor = await nService.readRegister(57);
		const msg = 'Qwe `qwe` qwe';

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
				resolve(wirelesSensor);
			});
		});
	}
}
module.exports = AlarmService;
