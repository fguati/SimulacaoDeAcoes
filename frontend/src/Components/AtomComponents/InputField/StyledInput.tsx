import styled from 'styled-components'

const Input = styled.input`
    /* Component border */
    border-color: var(--border-color);
    border-radius: 5px;
    border-width: 2px;

    /* Component size */
    width: 90%;
    max-width: 400px;
    box-sizing: border-box;
    
    /* Component spacing */
    padding: var(--font-based-spacing) var(--large-spacing);

    /* Component text */
    line-height: 100%;

    /* tablet styles */
    @media screen and (min-width: 375px) {
        /* Component text */
        font-size: var(--medium-font-size);
    }

    /* desktop styles */
    @media screen and (min-width: 1024px) {
        /* Component border */
        border-radius: 8px;

        /* Component text */
        font-size: var(--large-font-size);
    }
`

export default Input;