import styled from "styled-components";

interface IPropsTableHeaders {
    col?: number
}

const StyledTableHeader = styled.div`
    border: 1px solid var(--border-color);
    grid-row: 1;
    grid-column: ${(props: IPropsTableHeaders) => props.col ? props.col : 'auto'};
    padding: var(--default-spacing);

`

export default StyledTableHeader