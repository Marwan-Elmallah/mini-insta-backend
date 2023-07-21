const Joi = require("joi")

const registerSchema = {
    body: Joi.object().required().keys({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        cPassword: Joi.any().equal(Joi.ref("password")).required(),
        phone: Joi.string().required(),
        role: Joi.string().default("User"),
        gender: Joi.string(),
    })
}

loginSchema = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
}

module.exports = {
    registerSchema,
    loginSchema
}