//schema for the user table in the db. Contains the user id, its username, email (that must be unique to each user), and the password already hashed and with its salt
const USERS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(40) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    user_balance REAL DEFAULT 0 CHECK(user_balance >= 0),
    role VARCHAR(6) DEFAULT 'CLIENT' CHECK(role IN ('ADMIN', 'CLIENT'))
  );
  `

module.exports = USERS_SCHEMA