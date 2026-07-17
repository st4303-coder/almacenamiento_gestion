const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const appToken = req.header('app-token');

    if (!appToken) {
        return res.status(401).json({ error: "Unauthorized", message: "No hay token,permiso denegado" });
    }

    if (appToken !== process.env.APP_TOKEN_VALUE) {
        return res.status(401).json({ error: "Unauthorized", message: "oken no valido" });
    }

    next();
};