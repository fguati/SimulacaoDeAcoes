import styled from "styled-components";

interface IPropsStyledTable {
    cols?: number,
    rows?: number
}

// because rows and cols are optional props, the functions below give them a default value of 1
const rows = (props: IPropsStyledTable) => {
    return props.rows ? props.rows : 1
}
const cols = (props: IPropsStyledTable) => {
    return props.cols ? props.cols : 1
}

/**
 * Renders a table with the number of cols and rows entered as props. The table is a div with 
 * display grid instead of an actual table html element so there is no need to use tr elements
 * and therefore all cells can be in the same grid, allowing for better standardization of sizes
 */
const StyledTable = styled.div`
    display: grid;
    grid-template-columns: repeat(${cols}, 1fr);
    grid-template-rows: repeat(${rows}, 1fr);
    border: 1px solid var(--border-color);
    margin: 20px;

    /* @media screen and (max-width: 768px) {

    } */
`

export default StyledTable