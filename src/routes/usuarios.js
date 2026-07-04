const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');


router.post('/register', usuarioController.registerUsuario);
router.get('/getUsuario', usuarioController.getUsuario);

module.exports = router;