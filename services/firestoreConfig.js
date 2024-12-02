const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
    const db = new Firestore();

    const predictCollection = db.collection('predictions');
    return predictCollection.doc(id).set(data);
}

async function getFirestore() {
    const db = new Firestore();
    const predictCollection = db.collection('predictions');

    return await predictCollection.get();
}

module.exports = {storeData, getFirestore};