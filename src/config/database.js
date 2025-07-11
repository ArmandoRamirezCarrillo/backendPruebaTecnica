const mongoose = require('mongoose');

// Conexión a la base de datos MongoDB
const connectDB = async() => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Base de datos conectada`);
  } catch (error) {
    console.error('Error al conectarse a la base', error);
    process.exit(1);
  }
};

module.exports = connectDB;