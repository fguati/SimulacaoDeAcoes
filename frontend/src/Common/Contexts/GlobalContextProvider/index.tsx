import { ReactChildren } from "Common/Types";
import { PageThemeContextProvider } from "../PageThemeContext";
import { SessionProvider } from "../SessionContext";
import { CookiesProvider } from "react-cookie";
import { SnackbarProvider } from "../SnackbarContext";

//Component that provides all global contexts to the router component
function GlobalContextProvider({ children }: { children: ReactChildren }) {

    return (
        <PageThemeContextProvider>
			<SessionProvider>
				<CookiesProvider>
					<SnackbarProvider>
                        {children}
					</SnackbarProvider>
				</CookiesProvider>
			</SessionProvider>
		</PageThemeContextProvider>
    )
}

export default GlobalContextProvider