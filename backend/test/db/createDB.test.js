const db = require('../../src/db/createDB.js')
const sqlite3 = require('sqlite3').verbose()


test('Expect database to exist and be an instance of sqlite.Database', () => {
    expect(db).toBeInstanceOf(sqlite3.Database)
})