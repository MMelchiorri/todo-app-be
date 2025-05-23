const Database = require('../services/Database');

const database = Database.getInstance();

const readAll = (model) => async (req, res, next) => {
    try {
        const result = await database.getElements(model);
        res.json(result);
    } catch (err) {
        console.error('Error in readAll:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { readAll };
