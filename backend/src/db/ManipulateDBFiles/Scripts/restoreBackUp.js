const { dbFileDir } = require('#root/src/utils/globalVariables.js')
const createDB = require('../createDB.js')
const copyDB = require('../copyDBto.js')

const backUpFilePath = `${dbFileDir}\\dbBackUp.sqlite`

const dbFilePath = createDB(`db`)

copyDB(backUpFilePath).to(dbFilePath)