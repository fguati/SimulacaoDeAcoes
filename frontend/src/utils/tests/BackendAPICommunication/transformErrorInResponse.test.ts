import unknownError from "Pages/ErrorPage/useErrorHandler/unknownError"
import transformErrorInResponse from "utils/BackendAPICommunication/responseHandlers/transformErrorInResponse"
import httpStatus from "http-status"; 


describe('Test util function transformErrorInResponse', () => {
    const testError = new Error()
    it('must returt an unknown error if it lacks more info', () => {
        const receivedValue = transformErrorInResponse(testError)

        expect(receivedValue).toEqual(unknownError)
    })

    it('must return the entered error message', () => {
        testError.message = 'test message'

        const receivedValue = transformErrorInResponse(testError)

        expect(receivedValue).toEqual(expect.objectContaining({
            name: unknownError.name,
            code: unknownError.code,
            message: testError.message
        }))

    })

    it('must have the option of entering status code and message as arguments', () => {
        testError.message = 'test message'
        const testMessage = 'diferent test message'
        const testCode = 422

        const receivedValue = transformErrorInResponse(testError, testCode, testMessage)

        expect(receivedValue).toEqual(expect.objectContaining({
            name: httpStatus[testCode],
            code: testCode,
            message: testMessage
        }))
    })
})