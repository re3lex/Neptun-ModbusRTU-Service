const defaultLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info';

const targets = [{
	level: defaultLevel,
	target: '#pino/pretty',
	options: {
		translateTime: 'SYS:standard',
		colorize: false,
		ignore: 'pid,hostname',
		destination: `${process.cwd()}/logs/app.log`,
	},
}];

if (process.env.NODE_ENV === 'development') {
	targets.push({
		level: defaultLevel,
		target: '#pino/pretty',
		options: {
			translateTime: 'SYS:standard',
			colorize: true,
			ignore: 'pid,hostname',
		},
	});
}

const pino = require('pino');

const transport = pino.transport({
	targets,
});

const logger = pino(transport);

process.on('uncaughtException', pino.final(logger, (err, finalLogger) => {
	finalLogger.error(err, 'uncaughtException');
	process.exit(1);
}));

process.on('unhandledRejection', pino.final(logger, (err, finalLogger) => {
	finalLogger.error(err, 'unhandledRejection');
	process.exit(1);
}));

module.exports = {
	getLogger(name = 'default', level = defaultLevel) {
		return logger.child({ name }, { level });
	},
};
