const NeptunClient = require('neptun-modbusrtu-registers/src/client/NeptunClient');
const logger = require('../logger/logger').getLogger('NeptunService');

class NeptunService {
	constructor() {
		if (!this.constructor.client) {
			logger.debug('Setup NeptunCLient start');
			const {
				NEPTUN_IP: neptunIp,
				NEPTUN_ID: neptunId,
			} = process.env;

			this.constructor.client = new NeptunClient({
				ip: neptunIp,
				id: neptunId,
			});
			logger.debug('Setup NeptunCLient end');
		}

		this.client = this.constructor.client;
	}

	async readRegister(regAddr) {
		const regCls = this.client.getRegisterClass(regAddr);
		if (!regCls) {
			throw new Error(`Register ${regAddr} not supported`);
		}

		const res = await this.client.read(regCls);
		return res.toJSON();
	}

	async readAll() {
		const res = await this.client.readAll();
		return res.map((r) => r.toJSON());
	}

	async writeAll(regData = []) {
		for (let i = 0; i < regData.length; i++) {
			const d = regData[i];
			// eslint-disable-next-line no-await-in-loop
			const res = await this.write(d);
			if (res !== true) {
				d.error = res;
			}
		}
		const withErrors = regData
			.filter((r) => r.error)
			.reduce((obj, r) => {
				obj[r.startReg] = r;
				return obj;
			}, {});
		const allRegs = await this.readAll();

		if (Object.keys(withErrors).length > 0) {
			allRegs.forEach((r) => {
				const regWithError = withErrors[r.startReg];
				if (regWithError) {
					r.error = regWithError.error;
				}
			});
		}

		return allRegs;
	}

	async write(data) {
		const { startReg } = data;
		if (startReg === undefined) {
			throw new Error('startReg is not defined');
		}
		const regCls = this.client.getRegisterClass(startReg);
		if (!regCls) {
			throw new Error(`Register ${startReg} not supported`);
		}

		const reg = regCls.fromJSON(data);
		const res = await this.client.write(reg);
		return res;
	}
}

module.exports = NeptunService;
