import {  RouteObject } from 'react-router-dom'
import errorRoute from './ErrorRoutes/errorRoute';
import notFoundRoute from './ErrorRoutes/notFoundRoute';
import ErrorPage from 'Pages/ErrorPage';
import AuthRequestBranch from './AuthRequiredRoutes/AuthChecker';
import loggedIndex from './AuthRequiredRoutes/loggedIndex';
import signUpRoute from './OpenRoutes/signUpRoute';
import loginRoute from './OpenRoutes/loginRoute';
import Header from 'Components/Header';

const routes:RouteObject[] = [
	{
		element: <Header/>,
		children: [
			{
			path: '/',
			errorElement:<ErrorPage/>,
			children:[
				{
					element: <AuthRequestBranch/>,
					children: [
						loggedIndex
					]
				},
				{
					children: [
						signUpRoute,
						loginRoute
					]
				}
			]
			},
			errorRoute,
			notFoundRoute

		]
	}
]

export default routes;
