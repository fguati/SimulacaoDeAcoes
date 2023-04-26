import './styles/App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from 'routes';
import GlobalContextProvider from 'Common/Contexts/GlobalContextProvider';

//App router rendered by react. It receives the routes implemented in the routes folder and nests them inside Global Providers 
function App() {
  const router = createBrowserRouter(routes)

  return (
	<div className="App">
		<GlobalContextProvider>
			<RouterProvider router={router}/>
		</GlobalContextProvider>
	</div>
  );
}

export default App;
