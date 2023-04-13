const { dbFileDir } = require('#root/src/utils/globalVariables.js')
const createDB = require('#root/src/db/utils/ManipulateDBFiles/createDB.js')
const copyDB = require('#root/src/db/utils/ManipulateDBFiles/copyDBto.js')

const backUpDB = createDB('dbBackUp')

const originalDB = `${dbFileDir}\\db.sqlite`

copyDB(originalDB).to(backUpDB)


