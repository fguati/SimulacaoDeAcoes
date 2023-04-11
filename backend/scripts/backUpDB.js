const { dbFileDir } = require('#root/src/utils/globalVariables.js')
const createDB = require('#root/src/db/utils/ManipulateDBFiles/createDB.js')
const copyDB = require('#root/src/db/utils/ManipulateDBFiles/copyDBto.js')

const backUpFilePath = createDB('dbBackUp')

const dbFilePath = `${dbFileDir}\\db.sqlite`

copyDB(dbFilePath).to(backUpFilePath)


