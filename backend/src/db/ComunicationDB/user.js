const { InvalidCredentialsError, NotFoundError } = require('../../CustomErrors')
const { InvalidInputError } = require('../../CustomErrors')
const { checkUniqueConstraintError, checkInvalidInputsErrors } = require('../../utils')
const { dbAll, dbRun, dbGet } = require('../utils/dbutils.js')

class UserDAO {
    static async select(property = '*') {
        const userPropertyList = ['username', 'email', 'hashed_password']
        const resultLimit = 5
        let selectSQL = `SELECT ${property} FROM users LIMIT ${resultLimit}`
        
        const prorIsInList = userPropertyList.some(item => item === property)

        if(!prorIsInList && property !== '*') {
            throw new InvalidInputError(`${property} is not a valid column in the user db`, property)
        }

        const users = await dbAll(selectSQL)
        return users

        
    }

    static async selectById(id) {
        const selectSQL = `SELECT * FROM users WHERE id=?`

        const selectedUser = await dbGet(selectSQL, [id])
        if(selectedUser) {
            return selectedUser
        }
        throw new InvalidInputError(`User id ${id} not found`, ['id'])
    }

    static async selectByEmail(email) {
        const selectSQL = `SELECT * FROM users WHERE email=?`

        const selectedUser = await dbGet(selectSQL, [email])
        if(selectedUser) {
            return selectedUser
        }
        
        throw new InvalidCredentialsError(`User email ${email} not found`)
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
        
        const selectedUser = await dbGet(`SELECT * FROM users WHERE id=?`, [id])
        if(!selectedUser) {
            throw new InvalidInputError(`User id ${id} not found`, ['id'])
        }

        await dbRun(deleteSQL, [id])
    }

    static async updateBalance(userId, fundsChange) {
        //sql
        const sql = `UPDATE users SET user_balance = user_balance + ${fundsChange} WHERE id = ? RETURNING id, user_balance;`
        
        try {
            //run sql
            const userDB = await dbGet(sql, [userId])

            //throw not found error if id is not in db
            if(!userDB) throw new NotFoundError('User id not found in our database')

            return userDB.user_balance
            
        } catch (error) {
            //throw invalid input error if change would make balance negative
            const isNegativeBalanceError = error.message.includes("SQLITE_CONSTRAINT: CHECK constraint failed: user_balance >= 0")
            if(isNegativeBalanceError) throw new InvalidInputError('User does not have enough funds to withdraw this ammount', ['fundsChange'])

            //throw error to be caught at controller layer
            throw error
        }
        
    }

}

module.exports = UserDAO
