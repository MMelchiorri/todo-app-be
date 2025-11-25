const mongoose = require('mongoose')
const { Schema } = mongoose
const { v4: uuidv4 } = require('uuid')

const Todos = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    default: '',
  },
  assignedTo: {
    type: String,
    default: '',
  },
  dueDate: {
    type: Date,
  },
  reminder: {
    type: Boolean,
    default: false,
  },
  reminderDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  priority: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: 'pending',
  },
})

Todos.index({ status: 1 })
Todos.index({ priority: 1 })

module.exports = mongoose.model('TodoModel', Todos)
