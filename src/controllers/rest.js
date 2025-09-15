const Database = require('../services/Database')
const NoDataError = require('../error/NoData')
const ExistDataError = require('../error/ExistData')
const { v4: uuidv4 } = require('uuid')
const database = Database.getInstance()
const consumer = require('../client/rabbitMQ/consumer')
const publisher = require('../client/rabbitMQ/producer')
const bcrypt = require('bcryptjs')

const readAll = (model) => async (req, res, next) => {
  try {
    const properties = Object.entries(req.query).reduce((acc, [key, value]) => {
      if (value === 'true') acc[key] = true
      else if (value === 'false') acc[key] = false
      else acc[key] = value
      return acc
    }, {})

    const result = await database.getElements(model, properties)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

const insert = (model) => async (req, res, next) => {
  if (model.modelName === 'UserModel') {
    req.body.createdAt = new Date()
    req.body.password = bcrypt.hashSync(req.body.password, 10)
  }

  try {
    req.body.id = uuidv4()
    const result = await database.insertElement(model, req.body)
    const exchange = model.modelName === 'UserModel' ? 'todo' : 'user'
    await publisher(result, exchange, req.method)
    await consumer(model)

    res.json(result)
  } catch (err) {
    if (err.code === 11000) {
      return next(new ExistDataError('Element already exists'))
    }
    next(err)
  }
}

const getById = (model) => async (req, res, next) => {
  try {
    const result = await database.getElementById(model, req.params.id)

    if (result) {
      res.send(result)
    } else {
      return next(new NoDataError('Element not found'))
    }
  } catch (err) {
    next(err)
  }
}

const put = (model) => async (req, res, next) => {
  try {
    const result = await database.getElementById(model, req.params.id)

    if (!result) {
      return next(new NoDataError('Element not found'))
    }
    await database.put(model, req.params.id, req.body)
    return res
      .status(200)
      .json(await database.getElementById(model, req.params.id))
  } catch (err) {
    next(err)
  }
}

const deleteById = (model) => async (req, res, next) => {
  try {
    const result = await database.getElementById(model, req.params.id)
    if (!result) {
      return next(new NoDataError('Element not found'))
    }
    await database.deleteElementById(model, req.params.id)
    const exchange = model.modelName === 'UserModel' ? 'todo' : 'user'
    await publisher(result, exchange, req.method)
    await consumer(model, 'DELETE')
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

const deleteAll = (model) => async (req, res, next) => {
  try {
    await database.deleteAll(model)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

module.exports = { readAll, insert, getById, put, deleteById, deleteAll }
