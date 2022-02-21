const { existsSync, mkdirSync } = require('fs');

const logFolder = `${process.cwd()}/logs`;
if (!existsSync(logFolder)) {
	mkdirSync(logFolder);
}

const defaultLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info';

const date = new Date();
const ts = `${date.toISOString().substr(0, 10)}T${date.toLocaleTimeString()}`.replace(/[-,:]/gi, '');

const targets = [{
	level: defaultLevel,
	target: '#pino/pretty',
	options: {
		translateTime: 'SYS:standard',
		colorize: false,
		ignore: 'pid,hostname',
		destination: `${logFolder}/app_${ts}.log`,
	},
},
{
	level: process.env.NODE_ENV === 'development' ? defaultLevel : 'error',
	target: '#pino/pretty',
	options: {
		translateTime: 'SYS:standard',
		colorize: true,
		ignore: 'pid,hostname',
	},
}];

const wrap = (logger) => {
	const { error, child } = logger;
	function errorRearranger(...args) {
		if (typeof args[0] === 'string' && args.length > 1) {
			for (let i = 1; i < args.length; i++) {
				const arg = args[i];
				if (arg instanceof Error) {
					const [err] = args.splice(i, 1);
					args.unshift(err);
				}
			}
		}
		return error.apply(this, args);
	}
	function childModifier(...args) {
		const c = child.apply(this, args);
		c.error = errorRearranger;
		c.child = childModifier;
		return c;
	}
	logger.error = errorRearranger;
	logger.child = childModifier;
	return logger;
};

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
		return wrap(logger.child({ name }, { level }));
	},
};
