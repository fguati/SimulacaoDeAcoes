//schema for the stock positions table in the db. Contains and id (primary key), the user id (foreign key associated with users table), the ticker of the stock (which along the user id should identify this position and, thefore, be unique), and the stock position and average price 
const POSITION_SCHEMA = `
  CREATE TABLE IF NOT EXISTS stock_positions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    stock_ticker VARCHAR(12) NOT NULL,
    stock_qty INTEGER NOT NULL,
    stock_avg_price REAL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_stock UNIQUE (user_id, stock_ticker)
  );
  `

module.exports = POSITION_SCHEMA