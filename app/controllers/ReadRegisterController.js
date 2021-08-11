const BaseController = require('./BaseController');
const NeptunService = require('../services/NeptunService');

class ReadRegisterController extends BaseController {
	async getData(request, reply) {
		const { regAddress } = request.params;
		const service = new NeptunService();
		const reg = await service.readRegister(parseInt(regAddress));
		return reg;
	}
}

module.exports = ReadRegisterController;
