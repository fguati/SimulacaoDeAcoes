import styled from "styled-components";

interface IPropsStyledTableCell {
    row?: number,
    column?: number,
    rowLength?: number,
    columnLength?: number
}

function selectProp(props: IPropsStyledTableCell, attribute: 'row' | 'column' | 'rowLength' | 'columnLength', standardValue: any) {
    const selectedAttribute = props[attribute]
    const returnValue = selectedAttribute ? selectedAttribute : standardValue
    return returnValue
}

const StyledTableItem = styled.div`
    border: 1px solid var(--border-color);
    grid-row: ${(props: IPropsStyledTableCell) => selectProp(props, 'row', 'auto')} / span ${(props: IPropsStyledTableCell) => selectProp(props, 'rowLength', '1')};
    grid-column: ${(props: IPropsStyledTableCell) => selectProp(props, 'column', 'auto')} / span ${(props: IPropsStyledTableCell) => selectProp(props, 'columnLength', '1')};
    text-align: center;
`

export default StyledTableItem