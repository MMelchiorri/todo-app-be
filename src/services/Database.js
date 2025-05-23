const mongoose = require('mongoose');
class Database{
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
        console.log(process.env.MONGO_URI)
        mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log('Database connection successful');
            })
            .catch(err => {
                console.error('Database connection error:', err);
            });
    }
}

module.exports = Database;