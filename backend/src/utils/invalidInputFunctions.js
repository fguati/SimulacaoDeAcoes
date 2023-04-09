function hasInvalidParam(paramList) {
    return paramList.some(param => !param)
}

function listInvalidInputs(objectWithInputs, listOfInputNames) {
    let resultList = listOfInputNames.map((inputName) => {
        const inputValue = objectWithInputs[inputName]
        return !inputValue ? inputName :''
    })

    resultList = resultList.filter(entry => entry !== '')

    return resultList
}

module.exports = { hasInvalidParam, listInvalidInputs }