import HomeBrokerPage from "Pages/HomeBrokerPage";
import { RouteObject } from "react-router-dom";

//Route to page where trades are done
const homeBrokerRoute: RouteObject ={
    path: 'homebroker',
    element: <HomeBrokerPage/>
}

export default homeBrokerRoute