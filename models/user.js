const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const {config}= require("../middlewares/secret")

const schema = new mongoose.Schema({
    name: String,
    email:{type:String, unique:true},
    phone: String,
    password: String,
    role: {
        type: String,
        default: "user",
        enum: ["user","admin"]
    }
},{timestamps:true})
exports.UserModel = mongoose.model('users', schema);

exports.validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        email: Joi.string().min(2).max(300).required().email(),
        phone: Joi.string().length(10).pattern(/^05[0-9]+$/).message('Invalid phone number').required(),
        password: Joi.string().min(2).max(300).required(),
    })
    return schema.validate(user);
}
exports.validateLogin = (user) => {
    const schema = Joi.object({
        email: Joi.string().min(2).max(300).required().email(),
        password: Joi.string().min(2).max(300).required()
    })
    return schema.validate(user);
}
exports.getToken = (_id,role) => {
    return jwt.sign({_id,role},config.tokenSecret, {expiresIn:'15d'})
}
exports.validateEditUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(99).optional(),
        email: Joi.string().min(2).max(300).email().optional(),
        phone: Joi.string().length(10).pattern(/^05[0-9]+$/).message('Invalid phone number').optional(),
        password: Joi.string().min(2).max(300).allow(null, '').optional(),
        role: Joi.string().min(2).max(300).allow(null, '').optional()
    }).min(1);

    return schema.validate(user);
};

