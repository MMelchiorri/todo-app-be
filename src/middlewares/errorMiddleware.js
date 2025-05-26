const NoDataError = require("../error/NoData");

errorMiddleware = (err, req, res, next) => {
  if (err instanceof NoDataError) {
    res.status(404).json({ error: err.message });
  }
  next(err);
};

module.exports = errorMiddleware;
