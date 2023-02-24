const { InvalidCredentialsError } = require('../../CustomErrors')
const { InvalidInputError } = require('../../CustomErrors/InvalidInputError')
const { userPropertyList, hasInvalidParam, listInvalidInputs } = require('../../utils')

const checkUniqueConstraintError = require('../../utils/checkUniqueConstraintError.js')
const { dbAll, dbRun, dbGet } = require('../dbUtils.js')

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

    static async selectById(id) {
        const sql = `SELECT * FROM users WHERE id=?`

        try {
            const selectedUser = await dbGet(sql, [id])
            if(selectedUser) {
                return selectedUser
            }
            throw new InvalidInputError(`User id ${id} not found`, ['id'])
            
        } catch (error) {
            console.log(`Select Error: ${error}`); 
            throw error 
        }
    }

    static async selectByEmail(email) {
        const sql = `SELECT * FROM users WHERE email=?`

        try {
            const selectedUser = await dbGet(sql, [email])
            if(selectedUser) {
                return selectedUser
            }
            throw new InvalidCredentialsError(`User email ${email} not found`)
            
        } catch (error) {
            console.log(`Select Error: ${error}`); 
            throw error 
        }
    }

    static async insert(user) {
        const { nome, email, senhaHash } = user
        let sql = `INSERT INTO users (nome, email, senhaHash) VALUES (?, ?, ?)`;
        
        try {
            const listOfArguments = [nome, email, senhaHash]
            
            if(hasInvalidParam(listOfArguments)) {
                const InvalidInputList = listInvalidInputs(user, userPropertyList)
                throw new InvalidInputError('Invalid column', InvalidInputList)
            }
            
            await dbRun(sql, [nome, email, senhaHash])
            
        } catch (error) {
            console.log('Insert Error:', error.message)
            
            checkUniqueConstraintError(error)
            
            throw error
        }
    }

    static async delete(id) {
        const sql = `DELETE FROM users WHERE id=?`
        
        try {
            const selectedUser = await dbGet(`SELECT * FROM users WHERE id=?`, [id])
            if(!selectedUser) {
                throw new InvalidInputError(`User id ${id} not found`, ['id'])
            }

            await dbRun(sql, [id])
            console.log('did not throw')
        } catch (error) {
            console.log(`Delete Error: ${error}`); 
            throw error 
        }
    }

}

module.exports = UserDAO
