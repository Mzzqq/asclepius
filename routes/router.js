const {predictHandler} = require("../services/predict");
const {getHistoriesHandler} = require("../services/predictHistories");
const routes = [
    {
        method: 'POST',
        path: '/predict',
        handler: predictHandler,
        options: {
            payload: {
                parse: true,
                allow: 'multipart/form-data',
            }
        }
    },
    {
        method: 'GET',
        path: '/predict/histories',
        handler: getHistoriesHandler,
    }
];

module.exports = routes