const { InvalidCredentialsError } = require('../../CustomErrors')
const { InvalidInputError } = require('../../CustomErrors')
const { userPropertyList, hasInvalidParam, listInvalidInputs } = require('../../utils')

const checkUniqueConstraintError = require('../../utils/checkUniqueConstraintError.js')
const { dbAll, dbRun, dbGet } = require('../utils/dbutils.js')

class UserDAO {
    static async select(property = '*') {
        const resultLimit = 5
        let sql = `SELECT ${property} FROM users LIMIT ${resultLimit}`
        
        try {
            const isInList = userPropertyList.some( item => item === property)

            if(!isInList && property !== '*') {
                throw new InvalidInputError(`${property} is not a valid column in the user db`, property)
            }
            const rows = await dbAll(sql)
            return rows
        } catch (error) {
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
            throw error 
        }
    }

    static async insert(user) {
        const { username, email, hashed_password, salt } = user
        let sql = `INSERT INTO users (username, email, hashed_password, salt) VALUES (?, ?, ?, ?)`;
        
        try {
            const listOfArguments = [username, email, hashed_password, salt]
            
            if(hasInvalidParam(listOfArguments)) {
                const InvalidInputList = listInvalidInputs(user, userPropertyList)
                throw new InvalidInputError(`Invalid column`, InvalidInputList)
            }

            await dbRun(sql, [username, email, hashed_password, salt])
            
        } catch (error) {
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
        } catch (error) {
            throw error 
        }
    }

}

module.exports = UserDAO
