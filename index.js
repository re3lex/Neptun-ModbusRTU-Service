const dotenv = require('dotenv');
const path = require('path');
const fastifyCls = require('fastify');

const { setupRoutes } = require('./app/routes/routes');
const { setupCronJobs } = require('./app/cron/cron');

const result = dotenv.config();

if (result.error) {
	throw result.error;
}

const fastify = fastifyCls({ logger: true });

fastify.register(require('fastify-cors'), {
	origin: (origin, cb) => {
		if (/localhost/.test(origin)) {
			//  Request from localhost will pass
			cb(null, true);
			return;
		}

		cb(null, false);
	},
});

fastify.setNotFoundHandler(async (request, reply) => {
	reply.redirect(303, '/');
});

setupRoutes(fastify);

fastify.register(require('fastify-static'), {
	root: path.join(__dirname, 'dist'),
});

const start = async () => {
	try {
		await fastify.listen(3000, '0.0.0.0');
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

setupCronJobs();

start();
