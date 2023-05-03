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