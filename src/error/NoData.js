class NoDataError extends Error {
  constructor(message = "No data available") {
    super(message);
    this.name = "NoDataError";
  }
}

module.exports = NoDataError;
