import { IHideableElement } from "Common/Types"
import styled from "styled-components"

interface ContainerProps {
    onClick?: () => void
}

export const CardContainer = styled.li`
    /* Display properties */
    display: flex;
    justify-content: space-between;
    align-items: center;

    /* Box Properties */
    background-color: var(--background-light);
    padding: var(--default-spacing) var(--medium-spacing);
    margin: var(--medium-spacing) auto;
    border-radius: 8px;
    max-width: var(--max-width-page);
    width: 100%;

    /* Cursor properties */
    cursor: ${(props: ContainerProps) => props.onClick ? 'pointer' : 'auto'};
`

export const CardItem = styled.div`
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