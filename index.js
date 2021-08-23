const dotenv = require('dotenv');
const path = require('path');
const fastifyCls = require('fastify');
const { setupRoutes } = require('./app/routes/routes');

const result = dotenv.config();

if (result.error) {
	throw result.error;
}

const fastify = fastifyCls({ logger: true });

fastify.addHook('onSend', async (request, reply, payload) => {
	reply.header('Access-Control-Allow-Origin', '*');
	return payload;
});

fastify.setNotFoundHandler(async (request, reply) => {
	reply.redirect(303, '/');
});

setupRoutes(fastify);

fastify.register(require('fastify-static'), {
	root: path.join(__dirname, 'dist'),

	// prefix: '/public/', // optional: default '/'
});

const start = async () => {
	try {
		await fastify.listen(3000, '0.0.0.0');
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
