require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5100;
const connectDB = require('./src/config/database');
const expedientesRoutes = require('./src/routes/expedientes');
const usuariosRoutes = require('./src/routes/usuarios');
const appTokenMiddleware = require('./src/middlewares/appToken');

connectDB();

app.use(express.json());
app.use(appTokenMiddleware);
app.use('/api',expedientesRoutes);
app.use('/api/usuarios',usuariosRoutes);
app.listen(PORT, () =>{
    console.log(`Hello world: http://localhost:${PORT}`);
});