const { InvalidInputError, NotFoundError } = require("../../../src/CustomErrors")
const NegotiationDAO = require("../../../src/db/ComunicationDB/NegotiaionDAO")
const { dbGet, dbRun } = require("../../../src/db/utils/dbutils")

describe('Test the insert method in the negotiationDAO class', () => {
    const testNegotiation = {
        userId: 14, //id of user in the test db used to test negotiations
        stockTicker: "PETR3",
        negotiatedQty: 3,
        negotiatedPrice: 10.5,
        negotiationType: "BUY",
    }

    it('must create a new entry on the negotiation table in the db', async () => {
        const testSQL = `SELECT * FROM negotiations WHERE id=?`
        
        const { userId, stockTicker, negotiatedQty, negotiatedPrice, negotiationType } = testNegotiation

        const dbNegotiationId = await NegotiationDAO.insert(testNegotiation)
        const dbNegotiation = await dbGet(testSQL, dbNegotiationId.id)
        const dbNegotiationDate = new Date(dbNegotiation.negotiation_date)
        const today = new Date()

        expect(dbNegotiation).toEqual(expect.objectContaining({
            user_id: userId, 
            stock_ticker: stockTicker, 
            negotiated_qty: negotiatedQty, 
            negotiated_price: negotiatedPrice, 
            negotiation_type: negotiationType
        }))
        expect(dbNegotiationDate.getDate).toBe(today.getDate)
        expect(dbNegotiationDate.getMonth).toBe(today.getMonth)
        expect(dbNegotiationDate.getFullYear).toBe(today.getFullYear)

    })

    it('must throw an invalid input error if any mandatory parameter is not provided or has an invalid value', async () => {
        function testRejectFunction(testObject) {
            return async () => {
                await NegotiationDAO.insert(testObject)
            }
        }

        function testFunction(testObject) {
            expect(testRejectFunction(testObject)).rejects.toThrow(InvalidInputError)
            dbGet('SELECT * FROM negotiations WHERE user_id=? AND stock_ticker=? AND negotiated_qty=? AND negotiated_price=? AND negotiation_type=?', Object.values(testObject))
                .then(dbObject => {
                    expect(dbObject).toBe(undefined)
                })
        }

        // userId empty
        let invalidObject = {
            stockTicker: "NotExist3",
            negotiatedQty: 3,
            negotiatedPrice: 10.5,
            negotiationType: "BUY",
        }
        testFunction(invalidObject)

        // stockTicker empty
        invalidObject = {
            userId: 14, //id of user in the test db used to test negotiations
            negotiatedQty: 3,
            negotiatedPrice: 10.5,
            negotiationType: "BUY",
        }
        testFunction(invalidObject)
        
        // negotiatedQty empty
        invalidObject = {
            userId: 14, //id of user in the test db used to test negotiations
            stockTicker: "NotExist3",
            negotiatedPrice: 10.5,
            negotiationType: "BUY",
        }
        testFunction(invalidObject)
        
        // negotiatedPrice empty
        invalidObject = {
            userId: 14, //id of user in the test db used to test negotiations
            stockTicker: "NotExist3",
            negotiatedQty: 3,
            negotiationType: "BUY",
        }
        testFunction(invalidObject)
        
        // negotiationType empty
        invalidObject = {
            userId: 14, //id of user in the test db used to test negotiations
            stockTicker: "NotExist3",
            negotiatedQty: 3,
            negotiatedPrice: 10.5,
        }
        testFunction(invalidObject)
        
        // userId invalid
        invalidObject = {
            userId: null,
            stockTicker: "NotExist3",
            negotiatedQty: 3,
            negotiatedPrice: 10.5,
            negotiationType: "BUY",
        }
        testFunction(invalidObject)
        
        // stockTicker invalid
        invalidObject = {
            userId: 14, //id of user in the test db used to test negotiations
            stockTicker: null,
            negotiatedQty: 3,
            negotiatedPrice: 10.5,
            negotiationType: "BUY",
        }
        testFunction(invalidObject)
        
        // negotiatedQty invalid
        invalidObject = {
            userId: 14, //id of user in the test db used to test negotiations
            stockTicker: "NotExist3",
            negotiatedQty: 3.5,
            negotiatedPrice: 10.5,
            negotiationType: "BUY",
        }
        testFunction(invalidObject)
        
        // negotiatedPrice invalid
        invalidObject = {
            userId: 14, //id of user in the test db used to test negotiations
            stockTicker: "NotExist3",
            negotiatedQty: 3,
            negotiatedPrice: 'R$10.50',
            negotiationType: "BUY",
        }
        testFunction(invalidObject)
        
        // negotiationType invalid
        invalidObject = {
            userId: 14, //id of user in the test db used to test negotiations
            stockTicker: "NotExist3",
            negotiatedQty: 3,
            negotiatedPrice: 10.5,
            negotiationType: "Unsuported Type",
        }
        testFunction(invalidObject)
        
    })

    it('must throw a not found error if the user id entered does not exist', async () => {
        const invalidUserNegotiation = {
            userId: 9999999999,
            stockTicker: "PETR3",
            negotiatedQty: 3,
            negotiatedPrice: 10.5,
            negotiationType: "BUY",
        }

        async function testFunction() {
            await NegotiationDAO.insert(invalidUserNegotiation)
        }

        expect(testFunction).rejects.toThrow(NotFoundError)
    })

})

describe('Test the select method and all its optional filters in the negotiationDAO class', () => {
    it('Must return a list of negotiations', async () => {
        const result = await NegotiationDAO.select()
        expect(result).toEqual(expect.arrayContaining([expect.objectContaining({
            id: expect.any(Number),
            user_id: expect.any(Number),
            stock_ticker: expect.any(String),
            negotiated_qty: expect.any(Number),
            negotiated_price: expect.any(Number), 
            negotiation_type: expect.stringMatching(/BUY|SELL/),
            negotiation_date: expect.any(String)
        })]))
    })

    it('Must return a list of negotiations that fufills that entered filters', async () => {
        //test userId filter
        const testId = 14 //user from test DB
        const resultFilteredByUserId = await NegotiationDAO.select({ userId: testId })
        resultFilteredByUserId.forEach(row => {
            expect(row).toEqual(expect.objectContaining({
                id: expect.any(Number),
                user_id: testId,
                stock_ticker: expect.any(String),
                negotiated_qty: expect.any(Number),
                negotiated_price: expect.any(Number), 
                negotiation_type: expect.stringMatching(/BUY|SELL/),
                negotiation_date: expect.any(String)
            }))
        })

        //test userEmail filter
        const testEmail = 'alternanteUser@withNegotiationHistory.com' //user from test DB
        const userWithEnteredEmail = await dbGet('SELECT id FROM users WHERE email=?', [testEmail])
        const idFromTestEmail = userWithEnteredEmail.id
        const resultFilteredByUserEmail = await NegotiationDAO.select({ userEmail: testEmail })
        resultFilteredByUserEmail.forEach(row => {
            expect(row).toEqual(expect.objectContaining({
                id: expect.any(Number),
                user_id: idFromTestEmail,
                stock_ticker: expect.any(String),
                negotiated_qty: expect.any(Number),
                negotiated_price: expect.any(Number), 
                negotiation_type: expect.stringMatching(/BUY|SELL/),
                negotiation_date: expect.any(String)
            }))
        })

        //test stockTicker filter
        const testStock = 'TAEE11' //stock that test DB users have negotiations
        const resultFilteredByStock = await NegotiationDAO.select({ stockTicker: testStock })
        resultFilteredByStock.forEach(row => {
            expect(row).toEqual(expect.objectContaining({
                id: expect.any(Number),
                user_id: expect.any(Number),
                stock_ticker: testStock,
                negotiated_qty: expect.any(Number),
                negotiated_price: expect.any(Number), 
                negotiation_type: expect.stringMatching(/BUY|SELL/),
                negotiation_date: expect.any(String)
            }))
        })

        //test negotiationType filter
        const testType = 'SELL' 
        const resultFilteredByType = await NegotiationDAO.select({ negotiationType: testType })
        resultFilteredByType.forEach(row => {
            expect(row).toEqual(expect.objectContaining({
                id: expect.any(Number),
                user_id: expect.any(Number),
                stock_ticker: expect.any(String),
                negotiated_qty: expect.any(Number),
                negotiated_price: expect.any(Number), 
                negotiation_type: testType,
                negotiation_date: expect.any(String)
            }))
        })

        //test startDate filter
        const testStartDate = '2023-05-09' 
        await dbRun('INSERT INTO negotiations (user_id, stock_ticker, negotiated_qty, negotiated_price, negotiation_type, negotiation_date) VALUES ("14", "TAEE11", 100, 10.45, "BUY", "2023-05-10")')
        await dbRun('INSERT INTO negotiations (user_id, stock_ticker, negotiated_qty, negotiated_price, negotiation_type, negotiation_date) VALUES ("15", "HGBS11", 23, 45.48, "SELL", "2023-05-08")')
        await dbRun('INSERT INTO negotiations (user_id, stock_ticker, negotiated_qty, negotiated_price, negotiation_type, negotiation_date) VALUES ("15", "HGBS11", 23, 45.48, "SELL", "2023-05-11")')
        const resultFilteredByStartDate = await NegotiationDAO.select({ startDate: testStartDate })
        resultFilteredByStartDate.forEach(row => {
            expect(row).toEqual(expect.objectContaining({
                id: expect.any(Number),
                user_id: expect.any(Number),
                stock_ticker: expect.any(String),
                negotiated_qty: expect.any(Number),
                negotiated_price: expect.any(Number), 
                negotiation_type: expect.stringMatching(/BUY|SELL/),
            }))
            const dbDate = new Date(row.negotiation_date)
            const testStartDateObj = new Date(testStartDate)
            expect(dbDate.getTime()).toBeGreaterThanOrEqual(testStartDateObj.getTime())
        })

        //test endDate filter
        const testEndtDate = '2023-05-10' 
        const resultFilteredByEndDate = await NegotiationDAO.select({ endDate: testEndtDate })
        resultFilteredByEndDate.forEach(row => {
            expect(row).toEqual(expect.objectContaining({
                id: expect.any(Number),
                user_id: expect.any(Number),
                stock_ticker: expect.any(String),
                negotiated_qty: expect.any(Number),
                negotiated_price: expect.any(Number), 
                negotiation_type: expect.stringMatching(/BUY|SELL/),
            }))
            const dbDate = new Date(row.negotiation_date)
            const testEndDateObj = new Date(testEndtDate)
            expect(dbDate.getTime()).toBeLessThanOrEqual(testEndDateObj.getTime())
        })

        //test both date filters together
        const resultFilteredByBothDates = await NegotiationDAO.select({ endDate: testEndtDate, startDate: testStartDate })
        resultFilteredByBothDates.forEach(row => {
            expect(row).toEqual(expect.objectContaining({
                id: expect.any(Number),
                user_id: expect.any(Number),
                stock_ticker: expect.any(String),
                negotiated_qty: expect.any(Number),
                negotiated_price: expect.any(Number), 
                negotiation_type: expect.stringMatching(/BUY|SELL/),
            }))
            const dbDate = new Date(row.negotiation_date)
            const testEndDateObj = new Date(testEndtDate)
            const testStartDateObj = new Date(testStartDate)
            expect(dbDate.getTime()).toBeLessThanOrEqual(testEndDateObj.getTime())
            expect(dbDate.getTime()).toBeGreaterThanOrEqual(testStartDateObj.getTime())
        })
    })

    it('Must throw not found error if email filter receives an inexistent email', async () => {
        async function testFunction() {
            await NegotiationDAO.select({ userEmail: 'nonExistentEmail@test.com' })
        }

        await expect(testFunction).rejects.toThrow(NotFoundError)
    })

    it('Must throw an invalid input error if start date filter is later than end date filter', async () => {
        async function testFunction() {
            await NegotiationDAO.select({ startDate: '2023-05-10', endDate: '2023-05-08'})
        }

        await expect(testFunction).rejects.toThrow(InvalidInputError)
    })

    it('Must throw an invalid input error if has both user id and user email filters', async () => {
        async function testFunction() {
            await NegotiationDAO.select({userId: 14, userEmail: 'user@withNegotiationHistory.com'})
        }

        await expect(testFunction).rejects.toThrow(InvalidInputError)
    })
})