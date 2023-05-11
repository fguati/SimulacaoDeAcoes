const process = require('node:process');
const sqlite3 = require('sqlite3').verbose()
const SCHEMA_LIST = require('../Schemas')
const createDB = require('../utils/ManipulateDBFiles/createDB');

//Create the file for the sqlite database, in case it doesn't already exists, and store its filepath in a constant for later use
const dbFilePath = createDB('db')

//Create instance of connection with the database
const db = new sqlite3.Database(dbFilePath, (err) => {
    if(err){
        return console.log(`Erro na abertura do db: ${err.message}`)
    }
    console.log('Connected to db')
})

//Run sql to create any table still not in the database.
db.serialize(() => {
    db.run('PRAGMA foreign_keys=ON',(err) => {
        if(err){
            return console.log(`Erro no FK do db: ${err.message}`)
        }
    })

    SCHEMA_LIST.forEach(SchemaItem => {
        db.run(SchemaItem, (err) => {
            if(err){
                return console.log(`Erro na criação da tabela: ${err}`)
            }
        })
    })

})


//Logs the exit of the db and back up the db
process.on('SIGINT',() => {
    return db.close((err) => {
        if(err){
            return console.log(err.message)
        }

        console.log('Disconnected to db')
        process.exit(0)
    })

})

module.exports = db