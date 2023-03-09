import {  RouteObject } from 'react-router-dom'
import loginRoute from './loginRoute';
import signUpRoute from './signUpRoute';
import notFoundRoute from './notFoundRoute';
import rootRoute from './rootRoute';

const routes:RouteObject[] = [
  rootRoute,
  loginRoute,
  signUpRoute,
  notFoundRoute
]

export default routes;
