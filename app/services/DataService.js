const http = require('http');
const NeptunService = require('./NeptunService');
const logger = require('../logger/logger').getLogger('DataService');

class DataService {
	async sendData() {
		const neptunService = new NeptunService();
		const bathHotReg = await neptunService.readRegister(115);
		const bathColdReg = await neptunService.readRegister(117);
		const toiletHotReg = await neptunService.readRegister(119);
		const toiletColdReg = await neptunService.readRegister(121);

		try {
			const bathHot = bathHotReg.data.value / 1000;
			const bathCold = bathColdReg.data.value / 1000;
			const toiletHot = toiletHotReg.data.value / 1000;
			const toiletCold = toiletColdReg.data.value / 1000;

			this.sendGetCall('hot', 'bathroom', bathHot);
			this.sendGetCall('cold', 'bathroom', bathCold);
			this.sendGetCall('hot', 'toilet', toiletHot);
			this.sendGetCall('cold', 'toilet', toiletCold);
		} catch (e) {
			logger.error('Unable to send data to resource utilization');
			logger.error(e);
		}
	}

	sendGetCall(type, room, value) {
		const url = `http://192.168.1.123:7701/api/waterReadings/write/${type}/${room}/${value}`;
		logger.debug(`Making a call for ${type}/${room}/${value}: ${url}`);
		http.get(url, (resp) => {
			let data = '';

			// A chunk of data has been received.
			resp.on('data', (chunk) => {
				data += chunk;
			});

			// The whole response has been received. Print out the result.
			resp.on('end', () => {
				logger.info(data);
			});
		}).on('error', (err) => {
			logger.error(`Error sending ${type}/${room}/${value}: ${err.message}`);
		});
	}
}

module.exports = DataService;
