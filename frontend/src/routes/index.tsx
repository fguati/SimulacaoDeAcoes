import {  RouteObject } from 'react-router-dom'
import errorRoute from './ErrorRoutes/errorRoute';
import notFoundRoute from './ErrorRoutes/notFoundRoute';
import entryRoute from './entryRoute';

const routes:RouteObject[] = [
  entryRoute,
  errorRoute,
  notFoundRoute
]

export default routes;
