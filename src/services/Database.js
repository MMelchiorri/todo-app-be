const mongoose = require('mongoose')
const Redis = require('./Redis')
require('dotenv').config()

class Database {
  static instance
  static redisClient = Redis.getInstance().client
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
  constructor() {
    this.connect()
  }

  connect() {
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Database connection successful')
      })
      .catch((err) => {
        console.error('Database connection error:', err)
      })
  }

  async insertElement(model, data) {
    const element = new model(data)

    await element.save()

    Database.redisClient.hSet(`todo-session:${element._id}`, {
      id: element._id.toString(),
      name: element.name,
      description: element.description,
      completed: element.completed ? 'true' : 'false',
      tags: element.tags.join(','),
      category: element.category || '',
      assignedTo: element.assignedTo || '',
      dueDate: element.dueDate ? element.dueDate.toISOString() : '',
      reminder: element.reminder ? 'true' : 'false',
      reminderAt: element.reminderAt ? element.reminderAt.toISOString() : '',
      priority: element.priority || '',
      createdAt: element.createdAt.toISOString(),
    })
    Database.redisClient.expire(`todo-session:${element._id}`, 10)
    return element
  }

  async getElements(model, params = {}) {
    return await model.find(params).exec()
  }

  async getElementById(model, id) {
    if (!id) {
      throw new Error('ID is required to retrieve an element')
    }
    const todo = await Database.redisClient.hGetAll(`todo-session:${id}`)
    if (todo && Object.keys(todo).length > 0) {
      return {
        id: todo.id,
        name: todo.name,
        description: todo.description,
        completed: todo.completed === 'true',
        tags: todo.tags ? todo.tags.split(',') : [],
        category: todo.category || '',
        assignedTo: todo.assignedTo || '',
        dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
        reminder: todo.reminder === 'true',
        reminderAt: todo.reminderAt ? new Date(todo.reminderAt) : null,
        priority: todo.priority || '',
        createdAt: new Date(todo.createdAt),
      }
    }
    return await model.findById(id).exec()
  }

  async put(model, id, data) {
    const todoJob = await this.getElementById(model, id)
    if (!todoJob) {
      throw new Error('Element not found')
    }
    const updated = await model.findByIdAndUpdate(id, data).exec()

    const fields = [
      'id',
      updated._id.toString(),
      'name',
      updated.name,
      'description',
      updated.description,
      'completed',
      updated.completed ? 'true' : 'false',
      'tags',
      updated.tags.join(','),
      'category',
      updated.category || '',
      'assignedTo',
      updated.assignedTo || '',
      'dueDate',
      updated.dueDate ? updated.dueDate.toISOString() : '',
      'reminder',
      updated.reminder ? 'true' : 'false',
      'reminderAt',
      updated.reminderAt ? updated.reminderAt.toISOString() : '',
      'priority',
      updated.priority || '',
      'createdAt',
      updated.createdAt.toISOString(),
    ]

    await Database.redisClient
      .multi()
      .hSet(`todo-session:${id}`, fields)
      .expire(`todo-session:${id}`, 10)
      .exec()
  }

  async deleteElementById(model, id) {
    return await model.findByIdAndDelete(id).exec()
  }

  async deleteAll(model) {
    return await model.deleteMany().exec()
  }

  async addTodoToUser(usersModel, assignedTo, todo) {
    return usersModel.findOneAndUpdate(
      { username: assignedTo },
      { $push: { jobAssigned: todo } },
      { new: true },
    )
  }

  async updateUserFromTodo(todoModel, user) {
    await Promise.all(
      user.jobAssigned.map(async (jobId) => {
        const todo = await todoModel.findById(jobId).exec()
        if (todo && !todo.assignedTo) {
          todo.assignedTo = user.username
          await todo.save()
        }
      }),
    )
  }
  async deleteUserFromTodo(todoModel, user) {
    await Promise.all(
      user.jobAssigned.map(async (jobId) => {
        const todo = await todoModel.findById(jobId).exec()
        if (todo && todo.assignedTo === user.username) {
          todo.assignedTo = ''
          await todo.save()
        }
      }),
    )
  }
}

module.exports = Database
