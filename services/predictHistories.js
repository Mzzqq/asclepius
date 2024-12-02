const getHistoriesHandler = async (request, h) => {
  try {
    const snapshot = await firestore.collection('predictions').get();
    const histories = snapshot.docs.map(doc => ({
      id: doc.id,
      history: doc.data(),
    }));

    return {
      status: 'success',
      data: histories,
    };
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Gagal mengambil riwayat prediksi',
    }).code(500);
  }
};

module.exports = { getHistoriesHandler }