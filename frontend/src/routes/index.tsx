import {  RouteObject } from 'react-router-dom'
import { errorRoute, notFoundRoute } from './ErrorRoutes'
import ErrorPage from 'Pages/ErrorPage';
import { AuthRequestBranch, NegotiationHistoryRoute, homeBrokerRoute, loggedIndex } from './AuthRequiredRoutes'
import { loginRoute, signUpRoute } from './OpenRoutes'
import LoggedOffBranch from './OpenRoutes/LogedOffChecker';
import PageLayout from 'Components/PageLayout';

/**
 * The routes object of this file is the one actually used by the router 
 * of the app. It shows all the main routes (which may have their own children 
 * routes in their own files) and the route objects that work as functionality
 * or context providers to some of the routes
*/
const routes:RouteObject[] = [
	{
		element: <PageLayout/>,
		children: [
			{
			path: '/',
			errorElement:<ErrorPage/>,
			children:[
				{
					element: <AuthRequestBranch/>,
					children: [
						loggedIndex,
						homeBrokerRoute,
						NegotiationHistoryRoute
					]
				},
				{
					element: <LoggedOffBranch/>,
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
