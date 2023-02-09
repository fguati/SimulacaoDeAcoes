import { Link } from "react-router-dom"
import styled from "styled-components";

const HeaderContainer = styled.header`
    background-color: var(--background-color);
    display: flex;
    justify-content: end;
`
const StyledLink = styled(Link)`
    color: var(--light-font-color);
    padding: 8px;
`

function Header() {
    return (
        <HeaderContainer>
            <nav>
                <StyledLink to='/'>Login</StyledLink>
                <StyledLink to='/signup'>Sign Up</StyledLink>
            </nav>
        </HeaderContainer>
    )
}

export default Header;