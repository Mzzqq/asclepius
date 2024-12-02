const Hapi = require('@hapi/hapi');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const { Firestore } = require('@google-cloud/firestore');
const axios = require('axios');
const storage = new Storage();
const firestore = new Firestore();

const upload = multer({
    limits: { fileSize: 1000000 }, // Max 1MB
}).single('image');

const predictHandler = async (request, h) => {
    const file = request.payload.image;

    if (!file) {
        return h.response({
            status: 'fail',
            message: 'Gambar tidak ditemukan',
        }).code(400);
    }

    try {
        // Melakukan inferensi menggunakan model yang sudah di-deploy
        const result = await axios.post('http://model-inference-url', file.buffer, {
            headers: { 'Content-Type': 'application/octet-stream' },
        });

        const prediction = result.data.prediction;
        const resultData = {
            id: '77bd90fc-c126-4ceb-828d-f048dddff746', // ID unik
            result: prediction === 'Cancer' ? 'Cancer' : 'Non-cancer',
            suggestion: prediction === 'Cancer'
                ? 'Segera periksa ke dokter!'
                : 'Penyakit kanker tidak terdeteksi.',
            createdAt: new Date().toISOString(),
        };

        // Menyimpan hasil prediksi ke Firestore
        await firestore.collection('predictions').doc(resultData.id).set(resultData);

        return {
            status: 'success',
            message: 'Model is predicted successfully',
            data: resultData,
        };

    } catch (error) {
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi',
        }).code(400);
    }
};

module.exports = { predictHandler }