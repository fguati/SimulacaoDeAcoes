const {listInvalidInputs, hasInvalidParam} = require('#root/src/utils/invalidInputFunctions.js')

describe('Unit test of functions that receives a list of properties and an object and return a list of which properties dont have a valid value', () => {
    const testListOfProperties = ['emptyProp', 'notAvailableProp', 'okProp', 'nullProp']
    const testObject = {
        'emptyProp': '', 
        'okProp': 'okValue', 
        nullProp: null
    }

    test('listInvalidInputs must return a list with properties with invalid values', () => {

        const resultList = listInvalidInputs(testObject, testListOfProperties)

        expect(resultList).toEqual(['emptyProp', 'notAvailableProp', 'nullProp'])
    })

    test('hasInvalidInputs must return true if entered list has invalid properties and true if not', () => {
        let inputList = [null, 'valid input']
        let result = hasInvalidParam(inputList)
        expect(result).toBe(true)

        inputList = ['', 'valid input']
        result = hasInvalidParam(inputList)
        expect(result).toBe(true)

        inputList = ['valid input 1', 'valid input 2']
        result = hasInvalidParam(inputList)
        expect(result).toBe(false)

    })


})