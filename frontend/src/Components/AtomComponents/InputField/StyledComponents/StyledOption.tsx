import styled from "styled-components";

const Option = styled.option`

    /* Component box */
    width: 90%;
    max-width: 400px;
    box-sizing: border-box;
    background-color: var(--background-no-color);
    
    /* Component spacing */
    padding: var(--font-based-spacing) var(--large-spacing);

    /* Component text */
    line-height: 100%;
    color: var(--standard-font-color);

    /* tablet styles */
    @media screen and (min-width: 375px) {
        /* Component text */
        font-size: var(--medium-font-size);
    }

    /* desktop styles */
    @media screen and (min-width: 1024px) {
        /* Component text */
        font-size: var(--large-font-size);
    }
`

export default Option