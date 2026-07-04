const Usuarios = require('../models/usuarios');
const bcrypt = require('bcryptjs');

exports.registerUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validaciones básicas de entrada
        if (!email || !password) {
            return res.status(400).json({ msg: "Por favor, llena todos los campos obligatorios." });
        }

        // 2. Verificar si el usuario ya existe en la base de datos
        const usuarioExistente = await Usuarios.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ msg: "El correo electrónico ya está registrado." });
        }

        // 3. Encriptar la contraseña de forma segura
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptado = await bcrypt.hash(password, salt);

        // 4. Instanciar y guardar el nuevo usuario
        const nuevoUsuario = new Usuarios({
            email,
            password: passwordEncriptado
        });

        const usuarioGuardado = await nuevoUsuario.save();

        // 5. Responder al cliente. ¡Aquí verás reflejado el ID generado por Mongo!
        res.status(201).json({
            msg: "Usuario creado con éxito",
            usuario: {
                id: usuarioGuardado._id, // <--- Este es el ID que necesitas copiar para tus expedientes
                email: usuarioGuardado.email
            }
        });

    } catch (error) {
        res.status(500).json({ error: "Error al registrar el usuario", message: error.message });
    }
};

exports.getUsuario = async (req, res) => {
    try {
        const usuario = await Usuarios.find().select("-password"); 
        
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el usuario", message: error.message });
    }
}
