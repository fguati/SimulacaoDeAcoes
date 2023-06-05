import { PageThemeContextProvider } from "../PageThemeContext";
import { SessionProvider } from "../SessionContext";
import { CookiesProvider } from "react-cookie";
import { SnackbarProvider } from "../SnackbarContext";
import { Outlet } from "react-router-dom";

//Component that provides all global contexts to the router component
function GlobalContextProvider() {

    return (
        <PageThemeContextProvider>
			<SessionProvider>
				<CookiesProvider>
					<SnackbarProvider>
                        <Outlet/>
					</SnackbarProvider>
				</CookiesProvider>
			</SessionProvider>
		</PageThemeContextProvider>
    )
}

export default GlobalContextProvider