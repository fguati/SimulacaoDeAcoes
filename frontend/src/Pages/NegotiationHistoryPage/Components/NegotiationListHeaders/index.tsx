import { IHideableElement } from "Common/Types"
import styled from "styled-components"

//Element where the headers from the history list will be container
const HeadersContaianer = styled.div`
    /* Display properties */
    display: flex;
    justify-content: space-between;
    align-items: center;

    /* Box Properties */
    margin: var(--default-spacing) auto;
    max-width: var(--max-width-page);
    width: 100%;
    padding: 0 var(--medium-spacing);
`

//Element that will contain each header
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

//Component that renders the headers of the negotiations list
function NegotiationListHeaders({headersWidth}: {headersWidth: number}) {
    return (
        <HeadersContaianer>
            <HeaderItem width={headersWidth}>Date</HeaderItem>
            <HeaderItem width={headersWidth}>Qty</HeaderItem>
            <HeaderItem width={headersWidth}>Stock</HeaderItem>
            <HeaderItem width={headersWidth}>Price</HeaderItem>
            <HeaderItem width={headersWidth}>Type</HeaderItem>
        </HeadersContaianer>
    )
}

export default NegotiationListHeaders