import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { BrokerOptions, ServiceBroker } from 'moleculer';

export type FastifyMoleculerOptions = Partial<BrokerOptions> & {
  preClose?: (done: () => any) => void;
  serviceFolder?: string;
  serviceMask?: string;
};

const fastifyMoleculer: FastifyPluginAsync<FastifyMoleculerOptions> = fp(
  async function (fastify, opts: FastifyMoleculerOptions) {
    function defaultPreClose(done: () => any) {
      fastify.log.trace('Initializing shutting down moleculer message broker...');
      done();
    }

    const broker = new ServiceBroker(opts);
    broker.loadServices(opts.serviceFolder, opts.serviceMask);

    fastify.decorate('broker', broker);

    fastify.addHook('onReady', async () => {
      fastify.log.trace('Starting moleculer message broker...');
      if (!fastify.broker.started) await fastify.broker.start();
    });

    fastify.addHook('preClose', (done) => {
      if (opts.preClose) {
        return opts.preClose(done);
      }
      return defaultPreClose(done);
    });

    fastify.addHook('onClose', (fastify: FastifyInstance) => {
      fastify.log.trace('Stopping moleculer message broker...');
      return fastify.broker.started ? fastify.broker.stop() : Promise.resolve();
    });
  },
  { fastify: '>=4.x.x', name: 'fastify-moleculer' },
);

export default fastifyMoleculer;

declare module 'fastify' {
  export interface FastifyInstance {
    broker: ServiceBroker;
  }
}
