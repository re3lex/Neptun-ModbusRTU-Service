const BaseController = require('./BaseController');
const NeptunService = require('../services/NeptunService');

class WriteRegisterController extends BaseController {
	async getData(request, reply) {
		const service = new NeptunService();
		const data = request.body;
		const reg = await service.writeAll(data);
		return reg;
	}
}

module.exports = WriteRegisterController;
