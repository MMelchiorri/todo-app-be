class ExistData extends Error {
  constructor(message) {
    super(message)
    this.name = 'ExistDataError'
    this.statusCode = 409 // Conflict
  }
}

module.exports = ExistData
