const Database = require("../services/Database");
const { raw } = require("express");

const database = Database.getInstance();

const readAll = (model) => async (req, res, next) => {
  try {
    const result = await database.getElements(model);
    res.json(result);
  } catch (err) {
    console.error("Error in readAll:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const insert = (model) => async (req, res, next) => {
  try {
    const result = await database.insertElement(model, req.body);
    res.json(result);
  } catch (e) {
    console.log("error in insert", e);
  }
};

const getById = (model) => async (req, res, next) => {
  try {
    const result = await database.getElementById(model, req.params._id);

    if (result) {
      res.send(result);
    } else {
      res
        .status(404)
        .json({ message: `${model} with id ${req.params._id} not found.` });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { readAll, insert, getById };
