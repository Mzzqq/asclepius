require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

(async () => {
    try {
        const server = Hapi.server({
            port: process.env.PORT || 3500,
            host: 'localhost',
            routes: { cors: { origin: ['*'] } },
        });

        server.app.model = await loadModel();

        server.route(routes);

        server.ext('onPreResponse', (request, h) => {
            const { response } = request;

            if (response instanceof InputError) {
                return h
                    .response({ status: 'fail', message: response.message })
                    .code(response.statusCode);
            }

            if (response.isBoom) {
                return h
                    .response({ status: 'fail', message: response.output.payload.message })
                    .code(response.output.statusCode);
            }

            return h.continue;
        });

        await server.start();
        console.log(`Server running at: ${server.info.uri}`);
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
})();
