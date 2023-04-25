import styled from "styled-components";

const Button = styled.button`
    color: var(--light-font-color);
    background-color: var(--button-color);
    border-radius: 5px;
    border-color: var(--button-color);
    margin: var(--default-spacing);
    padding: var(--default-spacing) var(--xl-spacing);
    cursor: pointer;
    font-size: var(--default-font-size);

    @media screen and (min-width: 375px){
        font-size: var(--medium-font-size);
    }

    @media screen and (min-width: 1024px){
        font-size: var(--large-font-size);
    }
`

export default Button;