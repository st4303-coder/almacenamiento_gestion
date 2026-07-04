const express = require('express');
const router = express.Router();
const docController = require('../controllers/documentController');

// CREATE: Endpoint exacto POST /api/expedientes/upload solicitado
router.post('/upload', docController.uploadDocumento);

// READ: Obtener documentos pasando el ID del usuario en la URL
router.get('/usuario/:userId', docController.getDocumentosPorUsuario);

// UPDATE: Modificar archivo mediante el ID del documento
router.put('/:id', docController.updateDocumento);

// DELETE: Borrar archivo mediante el ID del documento
router.delete('/:id', docController.deleteDocumento);

module.exports = router;