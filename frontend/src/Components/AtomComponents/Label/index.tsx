import styled from "styled-components";

const Label = styled.label`
    color: var(--standard-font-color);
    font-size: var(--medium-font-size);
    font-weight: 500;

    @media screen and (min-width: 375px) {
        font-size: var(--large-font-size);
    }

    @media screen and (min-width: 1024px) {
        font-size: var(--xl-font-size);
    }
`

export default Label;