import styled from "styled-components";

const Paragraph = styled.p`
    color: var(--standard-font-color);
    font-size: var(--default-font-size);
    font-weight: 500;

    @media screen and (min-width: 1024px) {
        font-size: var(--medium-font-size);
    }
`

export default Paragraph;