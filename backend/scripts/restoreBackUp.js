const { dbFileDir } = require('#root/src/utils/globalVariables.js')
const createDB = require('#root/src/db/utils/ManipulateDBFiles/createDB.js')
const copyDB = require('#root/src/db/utils/ManipulateDBFiles/copyDBto.js')

const backUpDB = `${dbFileDir}\\dbBackUp.sqlite`

const dbToReceibeBackUp = createDB(`db`)

copyDB(backUpDB).to(dbToReceibeBackUp)