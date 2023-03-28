const {listInvalidInputs} = require('#root/src/utils/invalidInputFunctions.js')

describe('Unit test of functions that receives a list of properties and an object and return a list of which properties dont have a valid value', () => {
    it('must return a list with properties with invalid values', () => {
        const testListOfProperties = ['emptyProp', 'notAvailableProp', 'okProp', 'nullProp']
        const testObject = {
            'emptyProp': '', 
            'okProp': 'okValue', 
            nullProp: null
        }

        const resultList = listInvalidInputs(testObject, testListOfProperties)

        expect(resultList).toEqual(['emptyProp', 'notAvailableProp', 'nullProp'])
    })
})