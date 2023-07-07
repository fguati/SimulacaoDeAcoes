import { IHideableElement } from "Common/Types"
import ListCard from "Components/ListCard"
import { INegotiation } from "Interfaces/INegotiation"

interface Props {
    negotiation: INegotiation
    widthOfItemsInCard: number
}

//function the negotiation received and create an object that implements the Hideable Element interface, which is received as prop by the list card component 
const turnValuesToCardItems = (itemsWidth: number) => (negotiationPropertyValue: any): IHideableElement => {
    const valueToDisplay = negotiationPropertyValue instanceof Date ? negotiationPropertyValue.toLocaleDateString() : negotiationPropertyValue

    return {
        element: valueToDisplay,
        width: itemsWidth
    }
}

//component that renders each negotiation card in the transaction history
function NegotiationListItem({negotiation, widthOfItemsInCard}: Props) {
    const negotiationValues = Object.values(negotiation)
    const negotiationItems = negotiationValues.map(turnValuesToCardItems(widthOfItemsInCard))
    
    return (
        <ListCard cardItems={negotiationItems}/>
    )
}

export default NegotiationListItem