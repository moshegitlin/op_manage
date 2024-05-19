const mongoose = require('mongoose');
const Joi = require('joi');

const schema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    description:  String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    status: {
        type: Boolean,
        default: false
    },
    totalVolunteersNeeded: Number,
    currentVolunteers: Number
}, { timestamps: true });
exports.OpportunityModel = mongoose.model('opportunity', schema);
exports.validateOpportunity = (opportunity) => {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(20),
        phone: Joi.string().length(10).pattern(/^05[0-9]+$/).message('Invalid phone number').required(),
        address: Joi.string().required(),
        description: Joi.string().required().max(300),
        totalVolunteersNeeded: Joi.number().required().min(1),
    });
    return schema.validate(opportunity);
}
exports.validateEditOpportunity = (opportunity) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).optional(),
        phone: Joi.string().length(10).pattern(/^05[0-9]+$/).message('Invalid phone number').optional(),
        address: Joi.string().optional(),
        description: Joi.string().max(300).optional(),
        totalVolunteersNeeded: Joi.number().min(1).optional(),
        status: Joi.boolean().optional(),
        currentVolunteers: Joi.number().optional()
    }).min(1);
    return schema.validate(opportunity);
};


