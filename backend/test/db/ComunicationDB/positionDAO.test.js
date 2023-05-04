const { dbGet } = require("../../../src/db/utils/dbutils")
const positionDAO = require('../../../src/db/ComunicationDB/positionDAO.js')
const { InvalidInputError, UniqueConstraintError, NotFoundError } = require("../../../src/CustomErrors")

describe('Test insert queries on positions table', () => {
    const positionToBeInserted = {
        user_id: 1,
        stock_ticker: 'WEGE3',
        stock_qty: 10,
        stock_avg_price: 10.50
    }

    async function getPositionFromDB(userId, positionStock) {
        const sql = `SELECT * FROM stock_positions WHERE user_id=? AND stock_ticker=?`
        const position = await dbGet(sql, [userId, positionStock])
        return position
    }
    
    test('Correctly insert position on table', async () => {
        await positionDAO.insert(positionToBeInserted)

        const dbPosition = await getPositionFromDB(positionToBeInserted.user_id, positionToBeInserted.stock_ticker)

        expect(dbPosition).toEqual(expect.objectContaining(positionToBeInserted))
        expect(dbPosition.id).toEqual(expect.any(Number))

    })

    it('must throw an InvalidInputError if has a missing or invalid mandatory field', async () => {
        async function testFunction() {
            await positionDAO.insert(missingInputObj)
        }

        //missing user
        let missingInputObj = {
            stock_ticker: positionToBeInserted.stock_ticker,
            stock_qty: positionToBeInserted.stock_qty,
            stock_avg_price: positionToBeInserted.stock_avg_price
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)
        
        //missing ticker
        missingInputObj = {
            user_id: positionToBeInserted.user_id,
            stock_qty: positionToBeInserted.stock_qty,
            stock_avg_price: positionToBeInserted.stock_avg_price
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)

        //missing qty
        missingInputObj = {
            user_id: positionToBeInserted.user_id,
            stock_ticker: positionToBeInserted.stock_ticker,
            stock_avg_price: positionToBeInserted.stock_avg_price
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)

        //missing price
        missingInputObj = {
            user_id: positionToBeInserted.user_id,
            stock_ticker: positionToBeInserted.stock_ticker,
            stock_qty: positionToBeInserted.stock_qty,
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)

        //invalid user
        missingInputObj = {
            user_id: null,
            stock_ticker: positionToBeInserted.stock_ticker,
            stock_qty: positionToBeInserted.stock_qty,
            stock_avg_price: positionToBeInserted.stock_avg_price
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)

        //invalid ticker
        missingInputObj = {
            user_id: positionToBeInserted.user_id,
            stock_ticker: null,
            stock_qty: positionToBeInserted.stock_qty,
            stock_avg_price: positionToBeInserted.stock_avg_price
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)

        //invalid qty
        missingInputObj = {
            user_id: positionToBeInserted.user_id,
            stock_ticker: positionToBeInserted.stock_ticker,
            stock_qty: null,
            stock_avg_price: positionToBeInserted.stock_avg_price
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)

        //invalid price
        missingInputObj = {
            user_id: positionToBeInserted.user_id,
            stock_ticker: positionToBeInserted.stock_ticker,
            stock_qty: positionToBeInserted.stock_qty,
            stock_avg_price: null
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)
    
    })

    it('must throw an UniqueConstraintError if has an user with a repeated stock', async () => {
        async function testFunction() {
            await positionDAO.insert(positionToBeInserted)
        }

        expect(testFunction).rejects.toThrow(UniqueConstraintError)
    })

    it('must throw a NotFoundError if user id inserted does not belong to an existing user', async () => {
        const positionWithInvalidUser = {
            user_id: 10000,
            stock_ticker: positionToBeInserted.stock_ticker,
            stock_qty: positionToBeInserted.stock_qty,
            stock_avg_price: positionToBeInserted.stock_avg_price
        }

        async function testFunction() {
            await positionDAO.insert(positionWithInvalidUser)
        }

        expect(testFunction).rejects.toThrow(NotFoundError)
    })

})

describe.skip('Test insert position queries that use user Email instead of id', () => {
    const positionToBeInserted = {
        email: 'insertPosition@byEmail.test',
        stock_ticker: 'B3SA3',
        stock_qty: 10,
        stock_avg_price: 10.50
    }

    async function getPositionFromDB(userEmail, positionStock) {
        const sql = `SELECT stock_positions.* FROM stock_positions JOIN users ON stock_positions.user_id = users.id WHERE users.email=? AND stock_ticker=?;`
        const position = await dbGet(sql, [userEmail, positionStock])
        return position
    }

    test('insert by email method must succesfully create an entry on the DB', async () => {
        await positionDAO.insertByEmail(positionToBeInserted)

        const dbPosition = await getPositionFromDB(positionToBeInserted.email, positionToBeInserted.stock_ticker)

        expect(dbPosition).toEqual(expect.objectContaining({
            stock_ticker: positionToBeInserted.stock_ticker,
            stock_qty: positionToBeInserted.stock_qty,
            stock_avg_price: positionToBeInserted.stock_avg_price
        }))
        expect(dbPosition.id).toEqual(expect.any(Number))
    })

    it('must throw an InvalidInputError if has a missing or invalid mandatory field', async () => {
        
        async function testFunction() {
            await positionDAO.insertByEmail(missingInputObj)
        }

        //missing user
        let missingInputObj = {
            stock_ticker: positionToBeInserted.stock_ticker,
            stock_qty: positionToBeInserted.stock_qty,
            stock_avg_price: positionToBeInserted.stock_avg_price
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)
        
        //missing ticker
        missingInputObj = {
            email: positionToBeInserted.email,
            stock_qty: positionToBeInserted.stock_qty,
            stock_avg_price: positionToBeInserted.stock_avg_price
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)

        //missing qty
        missingInputObj = {
            email: positionToBeInserted.email,
            stock_ticker: positionToBeInserted.stock_ticker,
            stock_avg_price: positionToBeInserted.stock_avg_price
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)

        //missing price
        missingInputObj = {
            email: positionToBeInserted.email,
            stock_ticker: positionToBeInserted.stock_ticker,
            stock_qty: positionToBeInserted.stock_qty,
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)

        //invalid user
        missingInputObj = {
            email: null,
            stock_ticker: positionToBeInserted.stock_ticker,
            stock_qty: positionToBeInserted.stock_qty,
            stock_avg_price: positionToBeInserted.stock_avg_price
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)

        //invalid ticker
        missingInputObj = {
            email: positionToBeInserted.email,
            stock_ticker: null,
            stock_qty: positionToBeInserted.stock_qty,
            stock_avg_price: positionToBeInserted.stock_avg_price
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)

        //invalid qty
        missingInputObj = {
            email: positionToBeInserted.email,
            stock_ticker: positionToBeInserted.stock_ticker,
            stock_qty: null,
            stock_avg_price: positionToBeInserted.stock_avg_price
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)

        //invalid price
        missingInputObj = {
            email: positionToBeInserted.email,
            stock_ticker: positionToBeInserted.stock_ticker,
            stock_qty: positionToBeInserted.stock_qty,
            stock_avg_price: null
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)
    
    })

    it('must throw an UniqueConstraintError if has an user with a repeated stock', async () => {
        async function testFunction() {
            await positionDAO.insertByEmail(positionToBeInserted)
        }

        expect(testFunction).rejects.toThrow(UniqueConstraintError)
    })

    it('must throw a NotFoundError if user id inserted does not belong to an existing user', async () => {
        const positionWithInvalidUser = {
            email: 'emailThatIsInvalid@mail.com',
            stock_ticker: positionToBeInserted.stock_ticker,
            stock_qty: positionToBeInserted.stock_qty,
            stock_avg_price: positionToBeInserted.stock_avg_price
        }

        async function testFunction() {
            await positionDAO.insertByEmail(positionWithInvalidUser)
        }

        expect(testFunction).rejects.toThrow(NotFoundError)
    })
})