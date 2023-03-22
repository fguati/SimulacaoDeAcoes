import StyledLink from "Components/StyledLink"
import HeaderContainer from "./HeaderContainer"

function Header() {
    return (
        <HeaderContainer>
            <StyledLink to='/'>Home</StyledLink>

            <nav>
                <StyledLink to='/login'>Login</StyledLink>
                <StyledLink to='/signup'>Sign Up</StyledLink>
            </nav>
        </HeaderContainer>
    )
}

export default Header;