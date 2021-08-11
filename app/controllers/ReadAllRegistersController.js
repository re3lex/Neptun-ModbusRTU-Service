const BaseController = require('./BaseController');
const NeptunService = require('../services/NeptunService');

class ReadAllRegistersController extends BaseController {
	async getData(request, reply) {
		const service = new NeptunService();
		const reg = await service.readAll();
		return reg;
	}
}

module.exports = ReadAllRegistersController;
