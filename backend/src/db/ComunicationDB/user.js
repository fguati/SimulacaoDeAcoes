const { InvalidInputError } = require('../../CustomErrors/InvalidInputError')
const { userPropertyList, hasInvalidParam, listInvalidInputs } = require('../../utils')

const { dbAll, dbRun } = require('../dbUtils.js')

class UserDAO {
    static async select(property = '*') {
        let sql = `SELECT ${property} FROM users`
        
        try {
            const isInList = userPropertyList.some( item => item === property)

            if(!isInList && property !== '*') {
                throw new InvalidInputError(`${property} is not a valid column in the user db`, property)
            }
            const rows = await dbAll(sql)
            return rows
        } catch (error) {
            console.log(`Select Error: ${error}`); 
            throw error   
        }
        
    }

    static async insert(user) {
        const { nome, email, senhaHash } = user
        let sql = `INSERT INTO users (nome, email, senhaHash) VALUES (?, ?, ?)`;
        
        try {
            const listOfArguments = Object.values(user)
            
            if(hasInvalidParam(listOfArguments)) {
                const InvalidInputList = listInvalidInputs(user, userPropertyList)
                throw new InvalidInputError('Invalid column', InvalidInputList)
            }
            
            await dbRun(sql, [nome, email, senhaHash])
            
        } catch (error) {
            const isSqliteError = error.message.includes('SQLITE_CONSTRAINT')
            console.log('Insert Error:', error.message)
            
            if (isSqliteError) {
                const isUniqueConstraintError = error.message.includes('UNIQUE')
                const regexColumn = /users.(.*)/
                const errorColumn = error.message.match(regexColumn)[1]

                if(isUniqueConstraintError) {
                    
                    throw new InvalidInputError(`Column ${errorColumn} already has this entry`,[errorColumn])
                }
            }
            
            throw new Error(error.message)
        }
    }

    static async delete(id) {
        const sql = `DELETE FROM users WHERE id=?`
        
        try {
            await dbRun(sql, [id])
            
        } catch (error) {
            console.log(`Delete Error: ${error}`); 
            throw error 
        }
    }
}

module.exports = UserDAO
