const { dbFileDir } = require('#root/src/utils/globalVariables.js')
const createDB = require('../createDB.js')
const copyDB = require('../copyDBto.js')
const sqlite3 = require('sqlite3').verbose()
const fs = require('fs');

function populateTestDB(testDBFilePath){
    const sqlFilepath = `${dbFileDir}\\populateTestDB.sql`
    console.log(sqlFilepath)
    const sqlScript = fs.readFileSync(sqlFilepath).toString();
    
    const db = new sqlite3.Database(testDBFilePath, (err) => {
        if(err){
            return console.log(`Erro na abertura do db: ${err.message}`)
        }
        console.log('Connected to db')
    })
    
    db.exec(sqlScript, function(err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log('SQL script executed successfully');
        }
      
        db.close();
    });

}

const testDBFilePath = createDB('testDB')
const dbFilePath = `${dbFileDir}\\db.sqlite`
populateTestDB(testDBFilePath)
copyDB(testDBFilePath).to(dbFilePath)
