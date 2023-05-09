const { InvalidInputError, NotFoundError } = require("../../../src/CustomErrors")
const NegotiationDAO = require("../../../src/db/ComunicationDB/NegotiationDAO")
const { dbGet } = require("../../../src/db/utils/dbutils")

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
            const getDBNegotiation = dbGet('SELECT * FROM negotiations WHERE user_id=? AND stock_ticker=? AND negotiated_qty=? AND negotiated_price=? AND negotiation_type=?', Object.values(testObject))
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