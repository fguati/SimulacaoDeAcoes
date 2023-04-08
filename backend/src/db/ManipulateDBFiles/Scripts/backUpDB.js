const { dbFileDir } = require('#root/src/utils/globalVariables.js')
const createDB = require('../createDB.js')
const copyDB = require('../copyDBto.js')

const backUpFilePath = createDB('dbBackUp')

const dbFilePath = `${dbFileDir}\\db.sqlite`

copyDB(dbFilePath).to(backUpFilePath)


