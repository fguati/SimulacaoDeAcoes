import styled from "styled-components";

interface IPropsStyledTable {
    cols?: number,
    rows?: number
}

const rows = (props: IPropsStyledTable) => {
    return props.rows ? props.rows : 1
    
}

const cols = (props: IPropsStyledTable) => {
    return props.cols ? props.cols : 1
    
}

const StyledTable = styled.div`
    display: grid;
    grid-template-columns: repeat(${cols}, 1fr);
    grid-template-rows: repeat(${rows}, 1fr);
    border: 1px solid var(--border-color);
    margin: 20px;
`

export default StyledTable