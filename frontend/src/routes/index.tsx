import {  RouteObject } from 'react-router-dom'
import errorRoute from './errorRoute';
import notFoundRoute from './notFoundRoute';
import rootRoute from './rootRoute';

const routes:RouteObject[] = [
  rootRoute,
  notFoundRoute,
  errorRoute
]

export default routes;
