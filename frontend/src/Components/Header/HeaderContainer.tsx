import styled from "styled-components";

const HeaderContainer = styled.header`
    background-color: var(--background-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 5vh;
    margin-bottom: 1vh;

    nav {
        display: flex;
        align-items: center;
    }
`

export default HeaderContainer;