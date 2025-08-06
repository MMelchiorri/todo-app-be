const mongoose = require("mongoose");
class Database {
  static instance;
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error("Database connection error:", err);
      });
  }

  async insertElement(model, data) {
    try {
      const element = new model(data);
      await element.save();
      return element;
    } catch (error) {
      throw error;
    }
  }

  async getElements(model, params = {}) {
    return await model.find(params).exec();
  }

  async getElementById(model, id) {
    if (!id) {
      throw new Error("ID is required to retrieve an element");
    }
    return await model.findById(id).exec();
  }

  async put(model, id, data) {
    const todoJob = await this.getElementById(model, id);
    if (!todoJob) {
      throw new Error("Element not found");
    }
    return await model.updateOne({ id: id }, data).exec();
  }
  async deleteElementById(model, id) {
    return await model.findByIdAndDelete(id).exec();
  }

  async deleteAll(model) {
    return await model.deleteMany().exec();
  }
}

module.exports = Database;
