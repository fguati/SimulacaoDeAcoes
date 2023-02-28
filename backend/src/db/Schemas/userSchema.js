const { userPropertyList } = require('../../utils')

const USERS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ${userPropertyList[0]} VARCHAR(40) NOT NULL,
    ${userPropertyList[1]} VARCHAR(255) NOT NULL UNIQUE,
    ${userPropertyList[2]} VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL
  );
  `

module.exports = USERS_SCHEMA