const { userPropertyList } = require('../../utils')

const USERS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(40) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senhaHash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL
  );
  `

module.exports = USERS_SCHEMA