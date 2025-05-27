const NoDataError = require("../error/NoData");
const ExistData = require("../error/ExistData");

errorMiddleware = (err, req, res, next) => {
  if (err instanceof NoDataError) {
    return res.status(err.statusCode).json({ error: err.message });
  } else if (err instanceof ExistData) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  next(err);
};

module.exports = errorMiddleware;
