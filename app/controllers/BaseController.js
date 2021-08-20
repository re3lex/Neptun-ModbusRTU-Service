class BaseController {
	async handle(request, reply) {
		const start = new Date().valueOf();

		const data = await this.getData(request, reply);

		const execTime = new Date().valueOf() - start;

		// reply.header('Access-Control-Allow-Origin', '*');
		return { execTime, data };
	}

	async getData(request, reply) {
		throw new Error('Should be implemented in subclass');
	}
}

module.exports = BaseController;
