const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()

const SCHEMA_LIST = require('./Schemas')

const dbFilePath = `${__dirname}\\db.sqlite`
const existBefore = fs.existsSync(dbFilePath)

if(!existBefore){
    fs.writeFileSync(dbFilePath,'')
}

const db = new sqlite3.Database(dbFilePath, (err) => {
    if(err){
        return console.log(`Erro na abertura do db: ${err.message}`)
    }
    console.log('Connected to db')
})

if(!existBefore){
    db.run(`INSERT INTO users (nome, email, senhaHash, salt) VALUES ("nomeTeste", "algumExemplo", "senhaTeste", "saltTeste")`)

}

db.serialize(() => {
    // db.run('PRAGMA foreign_keys=ON',(err) => {
    //     return console.log(`Erro no FK do db: ${err.message}`)
    // })
    SCHEMA_LIST.forEach(SchemaItem => {
        db.run(SchemaItem, (err) => {
            if(err){
                return console.log(`Erro na criação da tabela do usuario: ${err}`)
            }
        })
    })

})

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