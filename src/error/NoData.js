class NoDataError extends Error {
  constructor(message = "No data available") {
    super(message);
    this.name = "NoDataError";
    this.statusCode = 404; // Not Found
  }
}

module.exports = NoDataError;
