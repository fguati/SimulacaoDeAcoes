import styled from "styled-components";

const Title = styled.h2`
    color: var(--standard-font-color);
    font-size: var(--large-font-size);
    font-weight: 500;

    @media screen and (min-width: 1024px) {
        font-size: var(--xl-font-size);
    }
`

export default Title;