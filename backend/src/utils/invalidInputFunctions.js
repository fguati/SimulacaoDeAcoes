function hasInvalidParam(paramList) {
    return paramList.some(param => !param)
}

function listInvalidInputs(paramObject, inputList) {
    let resultList = inputList.map((entry) => {
        const entryValue = paramObject[entry]
        return !entryValue ? entry :''
    })

    resultList = resultList.filter(entry => entry !== '')

    return resultList
}

module.exports = { hasInvalidParam, listInvalidInputs }