const { promisify } = require('util');
const db = require('./createDB.js')

const dbAll = promisify(db.all).bind(db);
const dbRun = promisify(db.run).bind(db);
const dbGet = promisify(db.get).bind(db);

module.exports = { dbAll, dbRun, dbGet }