import { fontSizeVariables } from "Common/Types";
import styled from "styled-components";

interface props {
    fontSize?: fontSizeVariables
}

const Paragraph = styled.p`
    color: var(--standard-font-color);
    font-size: var(${(props:props) => props.fontSize ?? '--default-font-size' });
    font-weight: 500;

    @media screen and (min-width: 1024px) {
        font-size: var(${(props:props) => props.fontSize ?? '--medium-font-size' });
    }
`

export default Paragraph;