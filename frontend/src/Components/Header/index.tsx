import StyledLink from "Components/StyledLink"
import HeaderContainer from "./HeaderContainer"

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