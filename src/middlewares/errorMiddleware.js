const NoDataError = require("../error/NoData");
const ExistData = require("../error/ExistData");

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof NoDataError || err instanceof ExistData) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Errore interno del server";

  return res.status(statusCode).json({ error: message });
};

module.exports = errorMiddleware;
