
const addProperties = <PropertyList>() => {
    return {
        toTarget(target: EventTarget) {
            const castedTarget = target as typeof target & PropertyList
            return castedTarget
        }
    }
}

export default addProperties