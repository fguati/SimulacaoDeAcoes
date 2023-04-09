const { dbFileDir } = require('#root/src/utils/globalVariables.js')
const createDB = require('#root/src/db/utils/ManipulateDBFiles/createDB.js')
const copyDB = require('#root/src/db/utils/ManipulateDBFiles/copyDBto.js')
const sqlite3 = require('sqlite3').verbose()
const fs = require('fs');

function populateDBWithTestData(dbFilePath){
    const sqlFilepath = `${dbFileDir}\\populateTestDB.sql`
    const sqlScript = fs.readFileSync(sqlFilepath).toString();
    
    const db = new sqlite3.Database(dbFilePath, (err) => {
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

const dbFilePath = `${dbFileDir}\\db.sqlite`
populateDBWithTestData(dbFilePath)
