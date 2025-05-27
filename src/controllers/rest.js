const Database = require("../services/Database");
const NoDataError = require("../error/NoData");
const ExistDataError = require("../error/ExistData");
const { v4: uuidv4 } = require("uuid");
const database = Database.getInstance();

const readAll = (model) => async (req, res, next) => {
  try {
    const result = await database.getElements(model);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const insert = (model) => async (req, res, next) => {
  try {
    req.body.id = uuidv4();
    const result = await database.insertElement(model, req.body);
    res.json(result);
  } catch (err) {
    if (err.code === 11000) {
      next(new ExistDataError("Element already exists"));
    }
    next(err);
  }
};

const getById = (model) => async (req, res, next) => {
  try {
    const result = await database.getElementById(model, req.params.id);

    if (result) {
      res.send(result);
    } else {
      return next(new NoDataError("Element not found"));
    }
  } catch (err) {
    next(err);
  }
};

const put = (model) => async (req, res, next) => {
  try {
    const result = await database.getElementById(model, req.params.id);
    if (!result) {
      return next(new NoDataError("Element not found"));
    }
    await database.put(model, req.params.id, req.body);
  } catch (err) {
    next(err);
  }
};

const deleteById = (model) => async (req, res, next) => {
  try {
    const result = await database.getElementById(model, req.params.id);
    if (!result) {
      return next(new NoDataError("Element not found"));
    }
    await database.deleteElementById(model, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { readAll, insert, getById, put, deleteById };
