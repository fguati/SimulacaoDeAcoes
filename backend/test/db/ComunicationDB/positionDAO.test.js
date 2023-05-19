const { dbGet, dbAll } = require("../../../src/db/utils/dbutils")
const PositionDAO = require('../../../src/db/ComunicationDB/PositionDAO.js')
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
        await PositionDAO.insert(positionToBeInserted)

        const dbPosition = await getPositionFromDB(positionToBeInserted.user_id, positionToBeInserted.stock_ticker)

        expect(dbPosition).toEqual(expect.objectContaining(positionToBeInserted))
        expect(dbPosition.id).toEqual(expect.any(Number))

    })

    it('must throw an InvalidInputError if has a missing or invalid mandatory field', async () => {
        async function testFunction() {
            await PositionDAO.insert(missingInputObj)
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
            await PositionDAO.insert(positionToBeInserted)
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
            await PositionDAO.insert(positionWithInvalidUser)
        }

        expect(testFunction).rejects.toThrow(NotFoundError)
    })

})

describe('Test insert position queries that use user Email instead of id', () => {
    const positionToBeInserted = {
        email: 'createPosition@byEmail.test',
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
        await PositionDAO.insertByEmail(positionToBeInserted)

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
            await PositionDAO.insertByEmail(missingInputObj)
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
            await PositionDAO.insertByEmail(positionToBeInserted)
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
            await PositionDAO.insertByEmail(positionWithInvalidUser)
        }

        expect(testFunction).rejects.toThrow(NotFoundError)
    })
})

describe('Test select by user id queries on positions table', () => {
    test('must return a list of positions with the entered user_id, if called without a stock ticker argument', async () => {
        const queriedPositions = await PositionDAO.selectByUserId(1)

        expect(queriedPositions).toEqual(expect.arrayContaining([expect.objectContaining({
            user_id: 1,
            stock_ticker: expect.any(String),
            stock_qty: expect.any(Number),
            stock_avg_price: expect.any(Number)
        })]))
        expect(queriedPositions.length).toBeGreaterThanOrEqual(1)

        queriedPositions.forEach(pos => {
            expect(pos).toEqual(expect.objectContaining({
                user_id: 1,
                stock_ticker: expect.any(String),
                stock_qty: expect.any(Number),
                stock_avg_price: expect.any(Number)
            }))
        })
    })

    test('must return position with the entered user_id and stock ticker', async () => {
        const queriedPosition = await PositionDAO.selectByUserId(1, "LEVE3")
        expect(queriedPosition).toEqual(expect.objectContaining({
            user_id: 1,
            stock_ticker: "LEVE3",
            stock_qty: expect.any(Number),
            stock_avg_price: expect.any(Number)
        }))

    })

    test('must throw invalid input error if userId was not entered', async () => {
        let testUser = null
        
        async function testFunction() {
            await PositionDAO.selectByUserId(testUser)
        }

        expect(testFunction).rejects.toThrow(InvalidInputError)

        testUser = ''
        expect(testFunction).rejects.toThrow(InvalidInputError)

    })

    test('must return an empty list if selected user has no stock positions', async () => {
        const queriedPositions = await PositionDAO.selectByUserId(10) //id 10 is the id of the user in the test DB that has no entries on the stock positions table

        expect(queriedPositions).toEqual([])
    })

})

describe('Test select by email queries to the stocl positions table', () => {
    test('must return a list of positions with the id of the user with the entered email, if called without a stock ticker argument', async () => {
        const queriedPositions = await PositionDAO.selectByUserEmail('testSelectPostition@byUser.Email')

        expect(queriedPositions).toEqual(expect.arrayContaining([expect.objectContaining({
            user_id: 9,
            stock_ticker: expect.any(String),
            stock_qty: expect.any(Number),
            stock_avg_price: expect.any(Number)
        })]))

        expect(queriedPositions.length).toBeGreaterThanOrEqual(1)

        queriedPositions.forEach(pos => {
            expect(pos).toEqual(expect.objectContaining({
                user_id: 9,
                stock_ticker: expect.any(String),
                stock_qty: expect.any(Number),
                stock_avg_price: expect.any(Number)
            }))
        })
    })

    test('must return position with the id of the user with the entered email and the entered stock ticker', async () => {
        const queriedPosition = await PositionDAO.selectByUserEmail('testSelectPostition@byUser.Email', 'LEVE3')
        expect(queriedPosition).toEqual(expect.objectContaining({
            user_id: 9,
            stock_ticker: "LEVE3",
            stock_qty: expect.any(Number),
            stock_avg_price: expect.any(Number)
        }))

    })

    test('must throw invalid input error if user email was not entered', async () => {
        let testUser = null
        
        async function testFunction() {
            await PositionDAO.selectByUserEmail(testUser)
        }

        expect(testFunction).rejects.toThrow(InvalidInputError)

        testUser = ''
        expect(testFunction).rejects.toThrow(InvalidInputError)
    })

    test('must throw not found error if searched email is not in users table', async () =>{
        const testEmail = 'emailThatNeverExisted@inDB.SelectPositionByEmailTest'

        async function testFunction() {
            await PositionDAO.selectByUserEmail(testEmail)
        }

        expect(testFunction).rejects.toThrow(NotFoundError)

        async function testFunctionWithStockFilter() {
            await PositionDAO.selectByUserEmail(testEmail, 'LEVE3')
        }

        expect(testFunctionWithStockFilter).rejects.toThrow(NotFoundError)

    })

    test('must return an empty list if searched email belongs to a user with no stocks', async () => {
        const testEmail = 'user@withnostocks.email'

        const result = await PositionDAO.selectByUserEmail(testEmail)

        expect(result).toEqual([])
    })

    test('must throw not found error if user dont have the searched stock', async () => {
        const testEmail = 'testSelectPostition@byUser.Email'
        const testStock = 'HGLG11'

        async function testFunction() {
            await PositionDAO.selectByUserEmail(testEmail, testStock)
        }

        expect(testFunction).rejects.toThrow(NotFoundError)
    })
})

describe('Test the delete method for the positionDAO class', () => {
    test('must successfully delete an entry', async () => {
        await PositionDAO.deleteByPositionId(9)

        const test = await dbAll('SELECT * from stock_positions WHERE id=9')

        expect(test).toEqual([])
    })

    test('must throw invalid input error if id is not entered', async () => {
        async function testFunction() {
            await PositionDAO.deleteByPositionId(null)
        }

        expect(testFunction).rejects.toThrow(InvalidInputError)

    })

    test('must throw not found error if entered id does not exist', async () => {
        async function testFunction() {
            await PositionDAO.deleteByPositionId(99999999999)
        }

        expect(testFunction).rejects.toThrow(NotFoundError)
    })
})

describe('Test the deleteIfExists method for the positionDAO class', () => {
    test('must successfully delete an entry', async () => {
        const userId = 11 //known data to be deleted from test db
        const testStock = 'KNRI11' //known data to be deleted from test db
        
        await PositionDAO.deleteIfExists(userId, testStock)

        const test = await dbAll('SELECT * from stock_positions WHERE user_id=? AND stock_ticker=?', [userId, testStock])

        expect(test).toEqual([])
    })

})

describe('Test the update method for the positionsDAO class', () => {
    const positionToUpdate = {
        userId: 12,
        stockTicker: 'LEVE3',
        stockQty: 200,
        stockAvgPrice: 273.48
    }

    it('updates an existing position', async () => {

        await PositionDAO.update(positionToUpdate)

        const positionOnDb = await dbGet(`
            SELECT * FROM stock_positions
                     WHERE stock_ticker=?
                     AND user_id=?
        `, [positionToUpdate.stockTicker, positionToUpdate.userId])

        expect(positionOnDb).toEqual(expect.objectContaining({
            id: expect.any(Number),
            user_id: positionToUpdate.userId,
            stock_ticker: positionToUpdate.stockTicker,
            stock_qty: positionToUpdate.stockQty,
            stock_avg_price: positionToUpdate.stockAvgPrice
        }))
    })

    it('throws invalid input error if any of the inputs is missing or invalid', async () => {
        async function testFunction() {
            await PositionDAO.update(missingInputObj)
        }

        //missing id
        let missingInputObj = {
            stockTicker: positionToUpdate.stockTicker, 
            stockQty: positionToUpdate.stockQty, 
            stockAvgPrice: positionToUpdate.stockAvgPrice
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)
        
        //missing ticker
        missingInputObj = {
            userId: positionToUpdate.userId,
            stockQty: positionToUpdate.stock_qty,
            stock_stockAvgPriceavg_price: positionToUpdate.stock_avg_price
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)

        //missing qty
        missingInputObj = {
            userId: positionToUpdate.userId,
            stockTicker: positionToUpdate.stockTicker, 
            stockAvgPrice: positionToUpdate.stockAvgPrice
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)

        //missing average price
        missingInputObj = {
            userId: positionToUpdate.userId,
            stockTicker: positionToUpdate.stockTicker, 
            stockQty: positionToUpdate.stockQty, 
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)
        
        //invalid id
        missingInputObj = {
            userId: null,
            stockTicker: positionToUpdate.stockTicker, 
            stockQty: positionToUpdate.stockQty, 
            stockAvgPrice: positionToUpdate.stockAvgPrice
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)
        
        //invalid ticker
        missingInputObj = {
            userId: positionToUpdate.userId,
            stockTicker: null, 
            stockQty: positionToUpdate.stockQty, 
            stockAvgPrice: positionToUpdate.stockAvgPrice
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)
        
        //invalid qty
        missingInputObj = {
            userId: positionToUpdate.userId,
            stockTicker: positionToUpdate.stockTicker, 
            stockQty: null, 
            stockAvgPrice: positionToUpdate.stockAvgPrice
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)
        
        //invalid average price
        missingInputObj = {
            userId: positionToUpdate.userId,
            stockTicker: positionToUpdate.stockTicker, 
            stockQty: positionToUpdate.stockQty, 
            stockAvgPrice: null
        };

        expect(testFunction).rejects.toThrow(InvalidInputError)
        
    })

    it('throws invalid input error if stock_qty is not an integer', async () => {
        const invalidData = {
            userId: 12,
            stockTicker: 'LEVE3',
            stockQty: 200.01,
            stockAvgPrice: 273.48
        }
        
        async function testFunction() {
            await PositionDAO.update(invalidData)
        }

        expect(testFunction).rejects.toThrow(InvalidInputError)
    })

    it('throws invalid input error if stock_avg_price is not a number', async () => {
        const invalidData = {
            userId: 12,
            stockTicker: 'LEVE3',
            stockQty: 200,
            stockAvgPrice: 'R$273.48'
        }
        
        async function testFunction() {
            await PositionDAO.update(invalidData)
        }

        expect(testFunction).rejects.toThrow(InvalidInputError)
    })
    
    it('throws a not found error if position is not found', async () => {
        let notFoundData = {
            userId: 10,
            stockTicker: 'LEVE3',
            stockQty: 200,
            stockAvgPrice: 273.48
        }
        
        async function testFunction() {
            await PositionDAO.update(notFoundData)
        }

        expect(testFunction).rejects.toThrow(NotFoundError)

        notFoundData.userId = 999
        expect(testFunction).rejects.toThrow(NotFoundError)
    })
})

describe('Test the insertOrUpdate method for the positionDAO class', () => {
    test('Insert data in the stock_positions table if there is no entry with the user id and stock ticker entered', async () => {
        const dataToBeInserted = {
            userId: 8,
            stockTicker: 'XPML11',
            stockQty: 100,
            stockAvgPrice: 15.27
        }

        const selectSQLtoCheck = `SELECT * FROM stock_positions WHERE stock_ticker=? AND user_id=?`

        let dbEntry = await dbGet(selectSQLtoCheck, [dataToBeInserted.stockTicker, dataToBeInserted.userId])
        expect(dbEntry).toBe(undefined)

        await PositionDAO.insertOrUpdate(dataToBeInserted)

        dbEntry = await dbGet(selectSQLtoCheck, [dataToBeInserted.stockTicker, dataToBeInserted.userId])
        expect(dbEntry).toEqual(expect.objectContaining({
            stock_ticker: dataToBeInserted.stockTicker,
            stock_qty: dataToBeInserted.stockQty,
            stock_avg_price: dataToBeInserted.stockAvgPrice,
            user_id: dataToBeInserted.userId
        }))

    })

    test('Update the data in the stock_positions table if there is an entry with the user id and stock ticker entered', async () => {
        const dataToBeInserted = {
            userId: 8,
            stockTicker: 'XPML11',
            stockQty: 50,
            stockAvgPrice: 10.22
        }
        
        const selectSQLtoCheck = `SELECT * FROM stock_positions WHERE stock_ticker=? AND user_id=?`

        let dbEntry = await dbGet(selectSQLtoCheck, [dataToBeInserted.stockTicker, dataToBeInserted.userId])

        expect(dbEntry.stock_qty).not.toBe(dataToBeInserted.stockQty)
        expect(dbEntry.stock_avg_price).not.toBe(dataToBeInserted.stockAvgPrice)
        expect(dbEntry).toEqual(expect.objectContaining({
            stock_ticker: dataToBeInserted.stockTicker,
            user_id: dataToBeInserted.userId
        }))

        await PositionDAO.insertOrUpdate(dataToBeInserted)

        dbEntry = await dbGet(selectSQLtoCheck, [dataToBeInserted.stockTicker, dataToBeInserted.userId])
        expect(dbEntry).toEqual(expect.objectContaining({
            stock_ticker: dataToBeInserted.stockTicker,
            stock_qty: dataToBeInserted.stockQty,
            stock_avg_price: dataToBeInserted.stockAvgPrice,
            user_id: dataToBeInserted.userId
        }))
    })

    test('Throw invalid input error if any mandatory argument in empty or invalid', async () => {
        const positionToUpdate = {
            userId: 8,
            stockTicker: 'LEVE3',
            stockQty: 200,
            stockAvgPrice: 273.48
        }

        function testFunction(testObject) {
            return async () => {
                await PositionDAO.insertOrUpdate(testObject)
            }
        }

        async function testDBFunction() {
            const testEnrty =  await dbGet('SELECT * FROM stock_positions WHERE stock_ticker=? AND user_id=?', [positionToUpdate.stockTicker, positionToUpdate.userId])
            if(testEnrty) {
                expect(testEnrty.stock_qty).not.toBe(positionToUpdate.stockQty)
                expect(testEnrty.stock_avg_price).not.toBe(positionToUpdate.stockAvgPrice)
                expect(testEnrty.stock_qty).not.toBe(missingInputObj.stockQty)
                expect(testEnrty.stock_avg_price).not.toBe(missingInputObj.stockAvgPrice)

            } else {
                expect(testEnrty).toBe(undefined)
            }
        }

         //missing user id
        let missingInputObj = {
            stockTicker: positionToUpdate.stockTicker, 
            stockQty: positionToUpdate.stockQty, 
            stockAvgPrice: positionToUpdate.stockAvgPrice
        };

        await expect(testFunction(missingInputObj)).rejects.toThrow(InvalidInputError)
        await testDBFunction()
        
        //missing ticker
        missingInputObj = {
            userId: positionToUpdate.userId,
            stockQty: positionToUpdate.stock_qty,
            stockAvgPrice: positionToUpdate.stock_avg_price
        };

        await expect(testFunction(missingInputObj)).rejects.toThrow(InvalidInputError)
        await testDBFunction()
        
        //invalid id
        missingInputObj = {
            userId: null,
            stockTicker: positionToUpdate.stockTicker, 
            stockQty: positionToUpdate.stockQty, 
            stockAvgPrice: positionToUpdate.stockAvgPrice
        };

        await expect(testFunction(missingInputObj)).rejects.toThrow(InvalidInputError)
        await testDBFunction()
        
        //invalid ticker
        missingInputObj = {
            userId: positionToUpdate.userId,
            stockTicker: null, 
            stockQty: positionToUpdate.stockQty, 
            stockAvgPrice: positionToUpdate.stockAvgPrice
        };

        await expect(testFunction(missingInputObj)).rejects.toThrow(InvalidInputError)
        await testDBFunction()
        
        //invalid qty
        missingInputObj = {
            userId: positionToUpdate.userId,
            stockTicker: positionToUpdate.stockTicker, 
            stockQty: 200.01, //
            stockAvgPrice: positionToUpdate.stockAvgPrice
        };

        await expect(testFunction(missingInputObj)).rejects.toThrow(InvalidInputError)
        await testDBFunction()
        
        //invalid average price
        missingInputObj = {
            userId: positionToUpdate.userId,
            stockTicker: positionToUpdate.stockTicker, 
            stockQty: positionToUpdate.stockQty, 
            stockAvgPrice: 'R$100.21'//
        };

        await expect(testFunction(missingInputObj)).rejects.toThrow(InvalidInputError)
        await testDBFunction()
    })

    test('Throw not found error if user email entered is not in the users table, including typing for quantity and average price', async () => {
        const notFoundData = {
            userId: 999999999999,
            stockTicker: 'LEVE3',
            stockQty: 200,
            stockAvgPrice: 273.48
        }
        
        async function testFunction() {
            await PositionDAO.insertOrUpdate(notFoundData)
        }

        await expect(testFunction).rejects.toThrow(NotFoundError)
    })
})
