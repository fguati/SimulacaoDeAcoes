import { INegotiation } from "Interfaces/INegotiation"
import NegotiationListHeaders from "../NegotiationListHeaders"
import NegotiationListItem from "../NegotiationListItem"
import styled from "styled-components"

interface Props {
    negotiationList: INegotiation[]
}

const ListContainer = styled.ul`
    display: flex;
    flex-direction: column;
    margin: var(--large-spacing) auto;
    max-width: var(--max-width-card);
`

//component that list all the negotiations done by user
function NegotiationList({negotiationList}: Props) {
    const listColumnWIdth = 65
    
    return (
        <ListContainer>
            <NegotiationListHeaders headersWidth={listColumnWIdth} />
            {negotiationList.map(renderNegotiationListItem(listColumnWIdth))}
        </ListContainer>
    )
}

export default NegotiationList

//aux function that takes a negotiation and returns a list item (card) to be rendered in the trade history
function renderNegotiationListItem(listColumnWIdth: number) {
    return (negotiation: INegotiation) => (
        <NegotiationListItem
            negotiation={negotiation}
            widthOfItemsInCard={listColumnWIdth}
            key={negotiation.id} 
        />
    )
}
