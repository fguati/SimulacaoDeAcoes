import { Link } from "react-router-dom"
import styled from "styled-components";

const StyledLink = styled(Link)`
    color: var(--light-font-color);
    padding: var(--default-spacing);
    text-decoration: none;
    font-size: var(--default-font-size);

    @media screen and (min-width: 375px){
        font-size: var(--medium-font-size);
    }

    @media screen and (min-width: 768px) {
        padding: var(--medium-spacing);
    }

    @media screen and (min-width: 1024px){
        font-size: var(--large-font-size);
    }
`

export default StyledLink;