const { dbFileDir } = require('#root/src/utils/globalVariables.js')
const createDB = require('#root/src/db/utils/ManipulateDBFiles/createDB.js')
const copyDB = require('#root/src/db/utils/ManipulateDBFiles/copyDBto.js')

const backUpFilePath = `${dbFileDir}\\dbBackUp.sqlite`

const dbFilePath = createDB(`db`)

copyDB(backUpFilePath).to(dbFilePath)