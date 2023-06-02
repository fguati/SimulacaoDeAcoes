import IFormField from "Interfaces/IFormField";

function turnFieldListInObject<objType>(listOfFields: IFormField[]) {
    const objMap = new Map()

    listOfFields.forEach(field => {
        const prop = field.fieldProperty
        if(prop) {
            objMap.set(prop, field.value)
        }
    })

    const returnObj = Object.fromEntries(objMap) as objType
    return returnObj

}

export default turnFieldListInObject