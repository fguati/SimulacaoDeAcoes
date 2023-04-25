import styled from "styled-components";

interface IProps {
    txtColor?: 'dark' | 'clear'
}

/**
 * Button that has no border or background. Receives the prop txtColor so 
 * it can have 2 diferent font colors: a clear one and a dark one, to be used 
 * to contrast the bg where the button is used 
*/
const BorderlessBtn = styled.button`
    background-color: none;
    color: ${(props: IProps) => (props.txtColor === 'dark' ? '(--dark-font-color)' : 'var(--light-font-color)')};
    border: none;
    cursor: pointer;

    @media screen and (min-width: 375px){
        font-size: var(--medium-font-size);
    }

    @media screen and (min-width: 1024px){
        font-size: var(--large-font-size);
    }
`

export default BorderlessBtn