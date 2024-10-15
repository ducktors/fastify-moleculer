import assert from 'node:assert';
import { once } from 'node:events';
import { Server as HttpServer } from 'node:http';
import { test } from 'node:test';
import fastify from 'fastify';
import { ServiceBroker } from 'moleculer';

import plugin from '../src';

test('should register the correct decorator', async () => {
  const app = fastify();

  app.register(plugin, { logger: false });

  await app.ready();

  assert.strictEqual(app.hasDecorator('broker'), true);
  assert.ok(app.broker instanceof ServiceBroker);
});

test('should start service broker on fastify ready', async () => {
  const app = fastify();

  app.register(plugin, { logger: false });

  await app.ready();
  assert.ok(app.broker.started);
});

test('should close service broker on fastify close', async () => {
  const PORT = 3030;
  const server = new HttpServer();
  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      // Should not be here
      try {
        assert.fail('Port is already in use');
      } catch (e) {
        setTimeout(() => {
          server.close();
          server.listen(PORT);
        }, 1000);
      }
    }
  });

  const app = fastify();

  app.register(plugin, {
    disableBalancer: true,
    metrics: false,
    logger: false,
    nodeID: 'test:broker',
  });

  await app.ready();
  await app.close();

  server.listen(PORT);

  await once(server, 'listening');

  server.close();
  assert.ok(!app.broker.started);
});

test('should register services as configured', async () => {
  const app = fastify();

  app.register(plugin, {
    logger: false,
    serviceFolder: './test/services',
    serviceMask: '*.service.ts',
  });

  await app.ready();
  assert.ok(app.broker.services.length === 2);
});
