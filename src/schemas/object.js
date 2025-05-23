const mongoose = require('mongoose');
const { Schema } = mongoose;

const ObjectSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    properties: {
        type: Object,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    priority: {
        type: Number,
        default: 0,
    }
})

export const ObjectModel = mongoose.model('Object', ObjectSchema);