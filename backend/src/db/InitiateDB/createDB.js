const fs = require('fs')
const path = require('path');

function createDB(dbFilename) {
    const dirname = __dirname
    const dbDir = path.dirname(dirname)
    const dbFilePath = `${dbDir}\\${dbFilename}.sqlite`
    const existBefore = fs.existsSync(dbFilePath)
    
    if(!existBefore){
        fs.writeFileSync(dbFilePath,'')
    }

    return dbFilePath

}


module.exports = createDB