const ReadAllRegistersController = require('../controllers/ReadAllRegistersController');
const ReadRegisterController = require('../controllers/ReadRegisterController');
const WriteRegisterController = require('../controllers/WriteRegisterController');
const AlarmService = require('../services/AlarmService');

const setupRoutes = (fastify) => {
	fastify.get('/api/readAll', async (request, reply) => {
		const controller = new ReadAllRegistersController();
		const res = await controller.handle(request, reply);
		return res;
	});

	fastify.get('/api/read/:regAddress', async (request, reply) => {
		const controller = new ReadRegisterController();
		const res = await controller.handle(request, reply);
		return res;
	});

	fastify.get('/api/telegram', async (request, reply) => {
		const alertService = new AlarmService();
		const res = await alertService.watchAlert();
		return res;
	});

	fastify.post('/api/write', async (request, reply) => {
		const controller = new WriteRegisterController();
		const res = await controller.handle(request, reply);
		return res;
	});
};

module.exports = {
	setupRoutes,
};
