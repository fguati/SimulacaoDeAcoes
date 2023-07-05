import styled from "styled-components"

interface Props {
    onClick?: () => void
}

const ListCard = styled.li`
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

    /* Font properties */
    color: var(--standard-font-color);
    font-size: var(--medium-font-size);
    cursor: ${(props: Props) => props.onClick ? 'pointer' : 'auto'};
`

export default ListCard