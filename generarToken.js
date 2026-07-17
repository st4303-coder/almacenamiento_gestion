const jwt = require('jsonwebtoken');
require('dotenv').config();


const payload = {
    info: "centralized_auth_app_token",
    type: "generic_app_token"
};


const tokenGenerico = jwt.sign(payload, process.env.JWT_SECRET);

console.log(tokenGenerico);
