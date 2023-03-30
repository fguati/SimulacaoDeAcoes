import StyledLink from "Components/StyledLink"
import useCookies from "react-cookie/cjs/useCookies";
import logOut from "utils/logOut";
import HeaderContainer from "./HeaderContainer"
import { useEffect } from 'react'

function Header() {
    const [cookies, setCookie] = useCookies()

    return (
        <HeaderContainer>
            <StyledLink to='/'>Home</StyledLink>

            {!cookies.authToken && <nav>
                <StyledLink to='/login'>Login</StyledLink>
                <StyledLink to='/signup'>Sign Up</StyledLink>
            </nav>}

            {cookies.authToken && <StyledLink to='/login' onClick={() => logOut()}>Log Out</StyledLink>}
        </HeaderContainer>
    )
}

export default Header;