const Database = require("../services/Database");
const NoDataError = require("../error/NoData");

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
