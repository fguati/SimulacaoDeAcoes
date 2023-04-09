const fs = require('fs')
const path = require('path');
const { dbFileDir } = require('#root/src/utils/globalVariables.js')

function createDB(dbFilename) {
    const dbFilePath = `${dbFileDir}\\${dbFilename}.sqlite`
    const existBefore = fs.existsSync(dbFilePath)
    
    if(!existBefore){
        fs.writeFileSync(dbFilePath,'')
    }

    return dbFilePath

}


module.exports = createDB