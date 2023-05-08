const USERS_SCHEMA = require('./userSchema.js')
const POSITION_SCHEMA = require('./positionSchema.js')
const NEGOTIATION_SCHEMA = require('./negotiationsSchema.js')

SCHEMA_LIST = [USERS_SCHEMA, POSITION_SCHEMA, NEGOTIATION_SCHEMA]

module.exports = SCHEMA_LIST