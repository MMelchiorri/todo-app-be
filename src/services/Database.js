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
      console.error("Error inserting element:", error);
      throw error;
    }
  }

  async getElements(model) {
    try {
      return await model.find();
    } catch (error) {
      console.error("Error getting elements:", error);
      throw error;
    }
  }
}

module.exports = Database;
