const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 4000;

// Conectar a la base de datos
connectDB();

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});