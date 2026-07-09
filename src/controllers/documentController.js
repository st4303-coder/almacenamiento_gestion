const multer = require('multer');
const fileType = require('file-type'); // Módulo para leer Magic Numbers
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra'); 
const path = require('path');
const UserDocument = require('../models/userDocument');


const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 } 
}).single('documento'); 

exports.uploadDocumento = (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ msg: "El archivo excede el límite máximo de 2MB" });
        } else if (err) {
            return res.status(500).json({ msg: "Error al procesar el archivo" });
        }

        if (!req.file) {
            return res.status(400).json({ msg: "No se ha proporcionado ningún archivo" });
        }

        try {
            const { userId, documentType } = req.body;
            
            if (!userId) {
                return res.status(400).json({ msg: "El campo userId es obligatorio" });
            }

            const tiposPermitidos = ['identity_card', 'passport', 'driver_license', 'profile_picture'];
            if (!tiposPermitidos.includes(documentType)) {
                return res.status(400).json({ msg: "Tipo de documento no válido" });
            }

            const fileInfo = await fileType.fromBuffer(req.file.buffer);
            const extensionesPermitidas = ['jpg', 'jpeg', 'png', 'pdf'];
            const mimesPermitidos = ['image/jpeg', 'image/png', 'application/pdf'];

            if (!fileInfo || !extensionesPermitidas.includes(fileInfo.ext) || !mimesPermitidos.includes(fileInfo.mime)) {
                return res.status(400).json({ msg: "Archivo malicioso o extensión no permitida (.jpg, .png, .pdf)" });
            }

            const nombreSeguro = `${uuidv4()}.${fileInfo.ext}`;
            const rutaDirectorioSeguro = path.join(__dirname, '../../storage_aislado'); 
            const rutaCompletaArchivo = path.join(rutaDirectorioSeguro, nombreSeguro);

            await fs.ensureDir(rutaDirectorioSeguro);
            await fs.writeFile(rutaCompletaArchivo, req.file.buffer);

      
            const nuevoDocumento = new UserDocument({
                userId, 
                documentType,
                fileUrl: rutaCompletaArchivo, 
                mimeType: fileInfo.mime
            });

            await nuevoDocumento.save();
            res.status(201).json({ msg: "Documento subido con éxito", documento: nuevoDocumento });

        } catch (error) {
            res.status(500).json({ error: "Error al guardar el archivo", message: error.message });
        }
    });
};


exports.getDocumentosPorUsuario = async (req, res) => {
    try {
        const { userId } = req.params; 
        const documentos = await UserDocument.find({ userId });
        res.json(documentos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener documentos" });
    }
};

exports.updateDocumento = (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ msg: "Error de archivo" });

        try {
            const { id } = req.params; 
            
            const documentoExistente = await UserDocument.findById(id);
            if (!documentoExistente) {
                return res.status(404).json({ msg: "Documento no encontrado" });
            }

            if (!req.file) {
                return res.status(400).json({ msg: "Debe subir un archivo nuevo para actualizar" });
            }

            const fileInfo = await fileType.fromBuffer(req.file.buffer);
            if (!fileInfo || !['jpg', 'jpeg', 'png', 'pdf'].includes(fileInfo.ext)) {
                return res.status(400).json({ msg: "Archivo inválido" });
            }

            if (await fs.pathExists(documentoExistente.fileUrl)) {
                await fs.unlink(documentoExistente.fileUrl);
            }

            const nuevoNombre = `${uuidv4()}.${fileInfo.ext}`;
            const nuevaRuta = path.join(__dirname, '../../storage_aislado', nuevoNombre);
            await fs.writeFile(nuevaRuta, req.file.buffer);

            documentoExistente.fileUrl = nuevaRuta;
            documentoExistente.mimeType = fileInfo.mime;
            documentoExistente.status = 'pending'; 
            await documentoExistente.save();

            res.json({ msg: "Documento actualizado correctamente", documento: documentoExistente });

        } catch (error) {
            res.status(500).json({ error: "Error al actualizar documento", message: error.message });
        }
    });
};

exports.deleteDocumento = async (req, res) => {
    try {
        const { id } = req.params;

        const documento = await UserDocument.findById(id);
        if (!documento) {
            return res.status(404).json({ msg: "Documento no encontrado" });
        }

        if (await fs.pathExists(documento.fileUrl)) {
            await fs.unlink(documento.fileUrl);
        }

        await UserDocument.findByIdAndDelete(id);

        res.json({ msg: "Documento eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el documento" });
    }
};