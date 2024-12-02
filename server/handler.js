const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const {storeData, getFirestore} = require('../services/firestoreConfig');

async function postPredictHandler(request, h) {
        const { image } = request.payload;
        const { model } = request.server.app;

        const { label, suggestion } = await predictClassification(model, image);

        const data = {
            id: crypto.randomUUID(),
            result: label,
            suggestion,
            createdAt: new Date().toISOString()
        };

        await storeData(data.id, data);

        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data
        }).code(201);
}

async function postPredictHistoriesHandler(request, h) {
    const Data = await getFirestore();

    const tempData = [];
    Data.forEach(doc => {
        const data = doc.data();
        tempData.push({
            id: doc.id,
            history: {
                result: data.result,
                createdAt: data.createdAt,
                suggestion: data.suggestion,
                id: doc.id
            }
        });
    });

    const response = h.response({
        status: 'success',
        data: tempData
    })
    response.code(200);
    return response;
}

module.exports = { postPredictHandler, postPredictHistoriesHandler };
