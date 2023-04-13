const { dbFileDir } = require('#root/src/utils/globalVariables.js')
const sqlite3 = require('sqlite3').verbose()
const createUserTableSQL = require('#root/src/db/Schemas/userSchema.js')
const testDbSql = require('./testDbSql.js')

function populateDBWithTestData(dbFilePath){
	const deleteUserTable = `DROP TABLE IF EXISTS users;`

    //conect to the database that will receive the test data
    const db = new sqlite3.Database(dbFilePath, (err) => {
        if(err){
            return console.log(`Erro na abertura do db: ${err.message}`)
        }
        console.log('Connected to db')
    })
    
	db.serialize(() => {
        //delete and re-create the user table in the database to guarantee the ids of the the entries in it will be the ones expected in the tests
		db.run(deleteUserTable)
		db.run(createUserTableSQL) 
		db.run(testDbSql)
	})

}

const dbFilePath = `${dbFileDir}\\db.sqlite`
populateDBWithTestData(dbFilePath)
