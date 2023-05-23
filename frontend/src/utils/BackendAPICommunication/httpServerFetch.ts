import { backendURL } from "Common/Constants"
import { BackendRoutes } from "Common/Types"
import transformErrorInResponse from "./transformErrorInResponse"

async function serverRequest(route: BackendRoutes, method = 'GET', body: unknown =  null) {
    //combines backend url with chosen route to get endpoint to which to post the form
    const endpoint = backendURL + route 
    
    const requestInit: RequestInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    }

    if(body) requestInit.body = JSON.stringify(body)

    console.log(endpoint, requestInit.body, requestInit.method)

    try {
        const response = await fetch(endpoint, requestInit)
        return response
        
    } catch (error) {
        console.log(error)
        //convert error into an error response so it can be used in response handler functions
        const errorResponse = transformErrorInResponse(error as Error)
        return errorResponse
    }
}

export default serverRequest