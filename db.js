// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbURI = 'mongodb+srv://Hazem:<Hazem>@cluster.idybuhc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster';
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB Atlas');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
    process.exit(1); // Quitte le processus si la connexion échoue
  }
};

module.exports = connectDB;
