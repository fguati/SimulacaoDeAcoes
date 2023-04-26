import { SnackbarProvider } from 'Common/Contexts/SnackbarContext';
import './styles/App.css';
import { SessionProvider } from 'Common/Contexts/SessionContext';
import { CookiesProvider } from 'react-cookie';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from 'routes';
import { PageThemeContextProvider } from 'Common/Contexts/PageThemeContext';

//App router rendered by react. It receives the routes implemented in the routes folder and nests them inside Global Providers 
function App() {
  const router = createBrowserRouter(routes)

  return (
	<div className="App">
		<PageThemeContextProvider>
			<SessionProvider>
				<CookiesProvider>
					<SnackbarProvider>
						<RouterProvider router={router}/>
					</SnackbarProvider>
				</CookiesProvider>
			</SessionProvider>
		</PageThemeContextProvider>
	</div>
  );
}

export default App;
