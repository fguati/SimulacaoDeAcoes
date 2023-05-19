const argumentValidators = require('./argumentValidators.js')
const negotiatioCalculations = require('./negotiationCalculations.js')
const updateDb = require('./updateDb.js')

module.exports = {...argumentValidators, ...negotiatioCalculations, ...updateDb}