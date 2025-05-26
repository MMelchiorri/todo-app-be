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
    const todo_job = await database.getElementById(model, req.body.id);
    if (todo_job) {
      console.log("Element already exists");
      return next(new ExistDataError("Element already exists"));
    }
    req.body.id = uuidv4();
    const result = await database.insertElement(model, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getById = (model) => async (req, res, next) => {
  try {
    const result = await database.getElementById(model, req.params._id);

    if (result) {
      res.send(result);
    } else {
      return next(new NoDataError("Element not found"));
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { readAll, insert, getById };
