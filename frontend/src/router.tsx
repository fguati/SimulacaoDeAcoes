import 'App.css';
import { SessionProvider } from 'Common/Contexts/SessionContext';
import { CookiesProvider } from 'react-cookie';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from 'routes';

function App() {
  const router = createBrowserRouter(routes)

  return (
	<div className="App">
		<SessionProvider>
			<CookiesProvider>
				<RouterProvider router={router}/>
			</CookiesProvider>
		</SessionProvider>
	</div>
  );
}

export default App;
