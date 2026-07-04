require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5100;
const connectDB = require('./src/config/database');
const expedientesRoutes = require('./src/routes/expedientes');
const usuariosRoutes = require('./src/routes/usuarios');

connectDB();

app.use(express.json());
app.use('/api',expedientesRoutes);
app.use('/api/usuarios',usuariosRoutes);
app.listen(PORT, () =>{
    console.log(`Hello world: http://localhost:${PORT}`);
});