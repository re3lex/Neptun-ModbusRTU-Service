const dotenv = require('dotenv');
const path = require('path');
const fastifyCls = require('fastify');
const { setupRoutes } = require('./app/routes/routes');

const result = dotenv.config();

if (result.error) {
	throw result.error;
}

const fastify = fastifyCls({ logger: true });

setupRoutes(fastify);

fastify.register(require('fastify-static'), {
	root: path.join(__dirname, 'dist'),

	// prefix: '/public/', // optional: default '/'
});

const start = async () => {
	try {
		await fastify.listen(3000);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
