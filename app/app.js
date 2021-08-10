// Require the framework and instantiate it
const fastifyCls = require('fastify');
const NeptunService = require('./neptun/NeptunService');



class Application {
  constructor({ port = 3000, neptunIp, neptunId }) {
    this.neptunIp = neptunIp;
    this.neptunId = neptunId;
    this.fastify = fastifyCls({ logger: true });

    this.setupRoutes();
  }

  setupRoutes() {
    // Declare a route
    this.fastify.get('/', async (request, reply) => {
      return { hello: 'world' }
    })

    this.fastify.get('/api/readAll', async (request, reply) => {
      const start = new Date().valueOf();
      const service = new NeptunService({
        neptunIp: this.neptunIp,
        neptunId: this.neptunId,
      })
      const reg = await service.readAll();
      const execTime = new Date().valueOf() - start;
      return { execTime, data: reg };
    });

    this.fastify.get('/api/read/:regAddress', async (request, reply) => {
      const start = new Date().valueOf();
      const { regAddress } = request.params;
      const service = new NeptunService({
        neptunIp: this.neptunIp,
        neptunId: this.neptunId,
      })
      const reg = await service.readRegister(parseInt(regAddress));
      const execTime = new Date().valueOf() - start;
      return { execTime, data: reg };
    });

    this.fastify.post('/api/write', async (request, reply) => {
      const data = request.body;
      const start = new Date().valueOf();
      const service = new NeptunService({
        neptunIp: this.neptunIp,
        neptunId: this.neptunId,
      })
      const reg = await service.write(data);
      const execTime = new Date().valueOf() - start;
      return { execTime, data: reg };
    });
  }

  async start() {
    try {
      await this.fastify.listen(3000)
    } catch (err) {
      this.fastify.log.error(err)
      process.exit(1)
    }
  }
}

module.exports = Application