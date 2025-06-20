const Database = require("../services/Database");
const NoDataError = require("../error/NoData");
const ExistDataError = require("../error/ExistData");
const { v4: uuidv4 } = require("uuid");
const database = Database.getInstance();
const bcrypt = require("bcryptjs");
const readAll = (model) => async (req, res, next) => {
  try {
    const properties = Object.entries(req.query).reduce((acc, [key, value]) => {
      if (value === "true") acc[key] = true;
      else if (value === "false") acc[key] = false;
      else acc[key] = value;
      return acc;
    }, {});

    const result = await database.getElements(model, properties);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const insert = (model) => async (req, res, next) => {
  console.log();
  if (model.modelName === "UserObject") {
    req.body.createdAt = new Date();
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }
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
