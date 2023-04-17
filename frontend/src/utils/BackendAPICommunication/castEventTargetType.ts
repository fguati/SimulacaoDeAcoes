/**
 * function that adds properties form a list type to an event target
 * Used to allow typescript to understand that the event target has 
 * the added properties and, therefore, access them
*/
const addProperties = <PropertyList>() => {
    return {
        toTarget(target: EventTarget) {
            const castedTarget = target as typeof target & PropertyList
            return castedTarget
        }
    }
}

export default addProperties