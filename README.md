# fastify-moleculer

[![CI](https://github.com/ducktors/fastify-moleculer/actions/workflows/ci.yml/badge.svg)](https://github.com/ducktors/fastify-moleculer/actions/workflows/ci.yml) [![Test](https://github.com/ducktors/fastify-moleculer/actions/workflows/test.yaml/badge.svg)](https://github.com/ducktors/fastify-moleculer/actions/workflows/test.yaml) [![npm](https://img.shields.io/npm/v/fastify-moleculer)](https://www.npmjs.com/package/fastify-moleculer) [![Coverage Status](https://coveralls.io/repos/github/ducktors/fastify-moleculer/badge.svg?branch=master)](https://coveralls.io/github/ducktors/fastify-moleculer?branch=master) [![Maintainability](https://api.codeclimate.com/v1/badges/8415332abe3ff865131d/maintainability)](https://codeclimate.com/github/ducktors/fastify-moleculer/maintainability) [![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/ducktors/fastify-moleculer/badge)](https://securityscorecards.dev/viewer/?uri=github.com/ducktors/fastify-moleculer)

`fastify-moleculer` enables the use of [Moleculer](https://moleculer.services/) in a Fastify application.

Supports Fastify versions `4.x`
Supports moleculer version `0.14`

## Install

```
npm i fastify-moleculer moleculer
```

## Usage

Require `fastify-moleculer` and register it as any other plugin, it will add a `broker` decorator.

`serviceFolder` & `serviceMask` options respect the configuration supported by moleculer [ServiceBroker](https://moleculer.services/docs/0.14/broker)

```js
const fastify = require("fastify")();

fastify.register(require("fastify-moleculer"), {
  // put your options here
  serviceFolder: './',          //load all services from the given folder
  serviceMask: '*.service.js'   //load all services whose file nane respect the given mask
});

fastify.get("/", (req, reply) => {
  fastify.broker.emit("hello", { who: 'world' });
});

fastify.listen({ port: 3000 });
```

For more details see [examples](https://github.com/ducktors/fastify-moleculer/tree/master/examples)

You can use it as is without passing any option, or you can configure it as explained by Moleculer [doc](https://moleculer.services/docs/0.14/configuration).

### Hooks

The plugin support a `preClose` hook to clean up loaded services in order to close correctly the fastify server. To configure this behaviour you can use `preClose` option:

```javascript
await fastify.register(require('fastify-moleculer'), {
  preClose: (done) => {
    // do other things
    // fastify.broker. ;
    done();
  }
})
```

The plugin also adds an `onClose` hook which closes the socket server when the `fastify` instance is closed.

## Typescript

The `broker` decorator is typed to moleculer [ServiceBroker](https://moleculer.services/docs/0.14/broker) type.
The plugin supports loading Typescript service classes from a given folder optionally overriding the default file mask of `.service.(js|ts)`.

## Contribute to this project

1. Clone this repository

   `git clone git@github.com:github.com/ducktors/fastify-moleculer.git`

2. Move inside repository folder

   `cd fastify-moleculer`

3. Install dependencies

   `pnpm install`

## How to release

The release is performed by the maintainers of the repository. New versions are managed via [changesets](https://github.com/changesets/changesets).

To release a new version, simply choose which package to bump with `pnpm release` command:

```
$ pnpm release

> @ducktors/fastify-moleculer@0.9.0 release /ducktors-workstation/fastify-moleculer
> changeset

```

## License

Licensed under [MIT](./LICENSE).<br/>
[`moleculer` license](https://github.com/moleculerjs/moleculer/blob/master/LICENSE)
