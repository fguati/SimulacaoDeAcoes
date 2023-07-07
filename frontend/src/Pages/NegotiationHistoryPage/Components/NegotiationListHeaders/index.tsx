import { IHideableElement } from "Common/Types"
import styled from "styled-components"


const HeadersContaianer = styled.div`
    /* Display properties */
    display: flex;
    justify-content: space-between;
    align-items: center;

    /* Box Properties */
    margin: var(--default-spacing) auto;
    max-width: var(--max-width-page);
    padding: 0 var(--medium-spacing);
`

const HeaderItem = styled.div`
    /* Font properties */
    color: var(--standard-font-color);
    font-size: var(--medium-font-size);

    /* Item Box properties */
    display: block;
    width: ${(props: IHideableElement) => props.width ? props.width + 'px' : 'auto'};

    @media screen and (max-width: 425px) {
        font-size: var(--default-font-size);
    }

    @media screen and (max-width: ${(props: IHideableElement) => props.hideOn}) {
        display: none;
    }
`

function NegotiationListHeaders() {
    return (
        <HeadersContaianer>
            <HeaderItem width={65}>Date</HeaderItem>
            <HeaderItem width={65}>Qty</HeaderItem>
            <HeaderItem width={65}>Stock</HeaderItem>
            <HeaderItem width={65}>Price</HeaderItem>
            <HeaderItem width={65}>Type</HeaderItem>
        </HeadersContaianer>
    )
}

export default NegotiationListHeaders