//schema for the negotiations of stocks table in the db. Contains an id as primary key, the id (FK) of the user that did the negotiation, the ticker, quantity and price of the stock negotiated, whether it was a buy or sell negotiation and the date of the negotiation
const NEGOTIATION_SCHEMA = `
  CREATE TABLE IF NOT EXISTS negotiations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    stock_ticker VARCHAR(12) NOT NULL,
    negotiated_qty INTEGER NOT NULL,
    negotiated_price REAL NOT NULL,
    negotiation_type VARCHAR(4) CHECK(negotiation_type IN ('BUY', 'SELL')),
    negotiation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  `

module.exports = NEGOTIATION_SCHEMA