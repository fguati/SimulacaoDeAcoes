const { dbFileDir } = require('#root/src/utils/globalVariables.js')
const sqlite3 = require('sqlite3').verbose()
const createNegotiationTableSQL = require('#root/src/db/Schemas/negotiationsSchema.js')
const createUserTableSQL = require('#root/src/db/Schemas/userSchema.js')
const createPositionsTableSQL = require('#root/src/db/Schemas/positionSchema.js')
const { positionDbSql, userDbSql, negotiationDbSql } = require('./testDbSql.js')

function populateDBWithTestData(dbFilePath){
	const deleteUserTable = `DROP TABLE IF EXISTS users;`
	const deletePositionsTable = `DROP TABLE IF EXISTS stock_positions;`
	const deleteNegotiationTable = `DROP TABLE IF EXISTS negotiations;`

    //conect to the database that will receive the test data
    const db = new sqlite3.Database(dbFilePath, (err) => {
        if(err){
            return console.log(`Erro na abertura do db: ${err.message}`)
        }
        console.log('Connected to db')
    })
    
	db.serialize(() => {
        //delete and re-create the tables in the database to guarantee the ids of the the entries in it will be the ones expected in the tests
		db.run(deleteUserTable)
		db.run(createUserTableSQL) 
		db.run(deletePositionsTable)
		db.run(createPositionsTableSQL) 
		db.run(deleteNegotiationTable)
		db.run(createNegotiationTableSQL) 
		db.run(userDbSql)
		db.run(positionDbSql)
		db.run(negotiationDbSql)
	})

}

const dbFilePath = `${dbFileDir}\\db.sqlite`
populateDBWithTestData(dbFilePath)
