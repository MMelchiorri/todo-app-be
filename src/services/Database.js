const mongoose = require('mongoose')
const Redis = require('./Redis')
const { createLock, NodeRedisAdapter } = require('redlock-universal')
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
    Database.redisClient.expire(`todo-session:${element._id}`, 3600)
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
  async getElementsByStatus(model, status) {
    return await model.find({ status: status })
  }

  async put(model, id, data) {
    const todoJob = await this.getElementById(model, id)
    if (!todoJob) {
      throw new Error('Element not found')
    }

    const lock = createLock({
      adapter: new NodeRedisAdapter(Database.redisClient),
      key: `locks:todo-session:${id}`,
      retryCount: 5,
      retryDelay: 100,
      ttl: 3600,
    })
    const handle = await lock.acquire()
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
    await lock.release(handle)
    return updated
  }

  async deleteElementById(model, id) {
    const isLocked = await Database.redisClient.exists(
      `locks:todo-session:${id}`,
    )
    if (isLocked) {
      throw new Error('Element is currently locked for editing')
    }
    const del = await model.findByIdAndDelete(id).exec()
    if (del) {
      await Database.redisClient.del(`todo-session:${id}`)
    }
    return del
  }

  async deleteAll(model) {
    await model.deleteMany().exec()
    const keys = await Database.redisClient.keys('todo-session:*')
    if (keys.length > 0) {
      await Database.redisClient.del(keys)
    }
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
