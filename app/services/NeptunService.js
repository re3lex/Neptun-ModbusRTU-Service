const NeptunClient = require('neptun-modbusrtu-registers/src/client/NeptunClient');

class NeptunService {
	constructor() {
		if (!this.constructor.client) {
			const {
				NEPTUN_IP: neptunIp,
				NEPTUN_ID: neptunId,
			} = process.env;

			this.constructor.client = new NeptunClient({
				ip: neptunIp,
				id: neptunId,
			});
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
		// eslint-disable-next-line no-console
		console.log(reg);

		// TODO
	}
}

module.exports = NeptunService;
