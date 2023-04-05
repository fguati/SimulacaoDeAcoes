import StyledLink from "Components/AtomComponents/StyledLink"
import useCookies from "react-cookie/cjs/useCookies";
import useLogOut from "utils/logOut";
import HeaderContainer from "./HeaderContainer"

function Header() {
    const [cookies] = useCookies()
    const logOut = useLogOut()

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