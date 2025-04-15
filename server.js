const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Configuration MongoDB
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'kafka_db';
const collectionName = 'messages';

app.use(express.json());

// Route pour récupérer tous les messages
app.get('/messages', async (req, res) => {
  const client = new MongoClient(mongoUrl);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const messages = await collection.find({}).toArray();
    res.json(messages);
  } catch (err) {
    console.error('Erreur lors de la récupération des messages', err);
    res.status(500).send('Erreur serveur');
  } finally {
    await client.close();
  }
});

// Route pour récupérer un message par ID
app.get('/messages/:id', async (req, res) => {
  const client = new MongoClient(mongoUrl);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const message = await collection.findOne({ _id: req.params.id });
    if (!message) {
      return res.status(404).send('Message non trouvé');
    }
    res.json(message);
  } catch (err) {
    console.error('Erreur lors de la récupération du message', err);
    res.status(500).send('Erreur serveur');
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Serveur API démarré sur http://localhost:${port}`);
});