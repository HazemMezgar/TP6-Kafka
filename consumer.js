const { Kafka } = require('kafkajs');
const { MongoClient } = require('mongodb');

// Configuration MongoDB
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'kafka_db';
const collectionName = 'messages';

// Configuration Kafka
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
  // Connexion à MongoDB
  const client = new MongoClient(mongoUrl);
  try {
    await client.connect();
    console.log('Connecté à MongoDB');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Connexion au consommateur Kafka
    await consumer.connect();
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const messageValue = message.value.toString();
        console.log({ value: messageValue });

        // Insérer le message dans MongoDB
        try {
          await collection.insertOne({
            message: messageValue,
            topic,
            partition,
            timestamp: new Date(),
          });
          console.log('Message enregistré dans MongoDB');
        } catch (err) {
          console.error('Erreur lors de l\'enregistrement dans MongoDB', err);
        }
      },
    });
  } catch (err) {
    console.error('Erreur', err);
  }
  // Ne ferme pas la connexion MongoDB pour que le consommateur continue de fonctionner
};

run().catch(console.error);