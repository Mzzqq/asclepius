const Hapi = require('@hapi/hapi');
const routes = require('./routes/router');

const init = async () => {
    const server = Hapi.server({
        port: 4000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            }
        }
    });

    server.route(routes);w
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

init();
