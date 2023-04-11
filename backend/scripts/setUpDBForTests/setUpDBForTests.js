const { dbFileDir } = require('#root/src/utils/globalVariables.js')
const sqlite3 = require('sqlite3').verbose()
const createUserTableSQL = require('#root/src/db/Schemas/userSchema.js')
const populateTestSQL = require('./populateTestDB.js')

function populateDBWithTestData(dbFilePath){
	const dropUserTableSQL = `DROP TABLE IF EXISTS users;`


    const db = new sqlite3.Database(dbFilePath, (err) => {
        if(err){
            return console.log(`Erro na abertura do db: ${err.message}`)
        }
        console.log('Connected to db')
    })
    
	db.serialize(() => {
		db.run(dropUserTableSQL)
		db.run(createUserTableSQL) 
		db.run(populateTestSQL)
	})

}

const dbFilePath = `${dbFileDir}\\db.sqlite`
populateDBWithTestData(dbFilePath)
