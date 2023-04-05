import 'App.css';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import routes from 'routes';
import Header from 'Components/Header';

function App() {
  const routesWithHeader: RouteObject[] = [{
    element: <Header/>,
    children: routes
  }]

  const router = createBrowserRouter(routesWithHeader)

  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
