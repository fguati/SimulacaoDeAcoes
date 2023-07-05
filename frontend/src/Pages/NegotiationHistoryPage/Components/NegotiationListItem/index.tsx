import { IHideableElement } from "Common/Types"
import ListCard from "Components/ListCard"
import { INegotiation } from "Interfaces/INegotiation"

interface Props {
    negotiation: INegotiation
}

const turnValuesToCardItems = (negotiationPropertyValue: any): IHideableElement => {
    const valueToDisplay = negotiationPropertyValue instanceof Date ? negotiationPropertyValue.toLocaleDateString() : negotiationPropertyValue

    return {
        element: valueToDisplay,
    }
}

function NegotiationListItem({negotiation}: Props) {
    const negotiationValues = Object.values(negotiation)
    const negotiationItems = negotiationValues.map(turnValuesToCardItems)
    
    return (
        <ListCard cardItems={negotiationItems}/>
    )
}

export default NegotiationListItem