import './styles/App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from 'routes';

//App router rendered by react. It receives the routes implemented in the routes folder and nests them inside Global Providers 
function App() {
  const router = createBrowserRouter(routes)

  return (
	<div className="App">
			<RouterProvider router={router}/>
	</div>
  );
}

export default App;
