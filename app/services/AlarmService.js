const { exec } = require('child_process');
const logger = require('../logger/logger').getLogger('AlarmService');

class AlarmService {
	sendAlert() {
		const msg = 'Qwe `qwe` qwe';

		exec(`/opt/telegram/send.sh '${msg}'`, (error, stdout, stderr) => {
			if (error) {
				logger.error(`error: ${error.message}`);
				return;
			}
			if (stderr) {
				logger.error(`stderr: ${stderr}`);
				return;
			}
			logger.info(`stdout: ${stdout}`);
		});
	}
}
module.exports = AlarmService;
