const { InvalidCredentialsError } = require('../../CustomErrors')
const { InvalidInputError } = require('../../CustomErrors')
const { checkUniqueConstraintError, checkInvalidInputsErrors } = require('../../utils')
const { dbAll, dbRun, dbGet } = require('../utils/dbutils.js')

class UserDAO {
    static async select(property = '*') {
        const userPropertyList = ['username', 'email', 'hashed_password']
        const resultLimit = 5
        let selectSQL = `SELECT ${property} FROM users LIMIT ${resultLimit}`
        
        try {
            const prorIsInList = userPropertyList.some(item => item === property)

            if(!prorIsInList && property !== '*') {
                throw new InvalidInputError(`${property} is not a valid column in the user db`, property)
            }

            const users = await dbAll(selectSQL)
            return users
        } catch (error) {
            throw error   
        }
        
    }

    static async selectById(id) {
        const selectSQL = `SELECT * FROM users WHERE id=?`

        try {
            const selectedUser = await dbGet(selectSQL, [id])
            if(selectedUser) {
                return selectedUser
            }
            throw new InvalidInputError(`User id ${id} not found`, ['id'])
            
        } catch (error) {
            throw error 
        }
    }

    static async selectByEmail(email) {
        const selectSQL = `SELECT * FROM users WHERE email=?`

        try {
            const selectedUser = await dbGet(selectSQL, [email])
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
        let insertSQL = `INSERT INTO users (username, email, hashed_password, salt) VALUES (?, ?, ?, ?)`;
        const userPropertyList = ['username', 'email', 'hashed_password', 'salt']

        try {
            const listOfArguments = [username, email, hashed_password, salt]
            
            checkInvalidInputsErrors(listOfArguments, user,userPropertyList)

            await dbRun(insertSQL, [username, email, hashed_password, salt])
            
        } catch (error) {
            checkUniqueConstraintError(error, 'users')
            
            throw error
        }
    }

    static async delete(id) {
        const deleteSQL = `DELETE FROM users WHERE id=?`
        
        try {
            const selectedUser = await dbGet(`SELECT * FROM users WHERE id=?`, [id])
            if(!selectedUser) {
                throw new InvalidInputError(`User id ${id} not found`, ['id'])
            }

            await dbRun(deleteSQL, [id])
        } catch (error) {
            throw error 
        }
    }

}

module.exports = UserDAO
