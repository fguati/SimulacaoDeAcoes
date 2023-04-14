/**receives a list of values that will be entered as arguments in 
 * a function or method and checks if any of them in invalid.
 * Used to validate data received through forms
*/
function hasInvalidParam(paramList) {
    return paramList.some(param => !param)
}


/**
 * Receives an object and a list of properties this object should
 * have. Makes then a list of every property of the list that does 
 * not have a valid value in the object
 */
function listInvalidInputs(objectWithInputs, listOfInputNames) {
    let resultList = listOfInputNames.map((inputName) => {
        const inputValue = objectWithInputs[inputName]
        return !inputValue ? inputName :''
    })

    resultList = resultList.filter(entry => entry !== '')

    return resultList
}

module.exports = { hasInvalidParam, listInvalidInputs }