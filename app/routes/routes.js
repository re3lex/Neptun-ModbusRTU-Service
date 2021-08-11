const ReadAllRegistersController = require('../controllers/ReadAllRegistersController');
const ReadRegisterController = require('../controllers/ReadRegisterController');
const WriteRegisterController = require('../controllers/WriteRegisterController');

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

	fastify.post('/api/write', async (request, reply) => {
		const controller = new WriteRegisterController();
		const res = await controller.handle(request, reply);
		return res;
	});
};

module.exports = {
	setupRoutes,
};
