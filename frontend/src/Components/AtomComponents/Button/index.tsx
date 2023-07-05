import styled from "styled-components";

interface IButtonProps {
    disabledStyle?: boolean
}

const Button = styled.button`
    color: ${(props: IButtonProps) => props.disabledStyle ? 'var(--disabled-font)' : 'var(--light-font-color)'};
    background-color: ${(props: IButtonProps) => props.disabledStyle ? 'var(--disabled-bg)' : 'var(--button-color)'};
    border-radius: 5px;
    border-color: ${(props: IButtonProps) => props.disabledStyle ? 'var(--disabled-bg)' : 'var(--button-color)'};
    margin: var(--default-spacing);
    padding: var(--default-spacing) var(--xl-spacing);
    cursor: ${(props: IButtonProps) => props.disabledStyle ? "default" : "pointer"};
    font-size: var(--default-font-size);

    :hover {
        opacity: ${(props: IButtonProps) => props.disabledStyle ? "100%" : "50%"};
    }

    @media screen and (min-width: 375px){
        font-size: var(--medium-font-size);
    }

    @media screen and (min-width: 1024px){
        font-size: var(--large-font-size);
    }

`

export default Button;