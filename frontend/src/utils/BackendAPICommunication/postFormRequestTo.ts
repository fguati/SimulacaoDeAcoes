import backendURL from "Common/backEndUrl";
import BackendRoutes from "Interfaces/BackendRoutes";

function postForm<bodyType>(body:bodyType) {
    const myInit: RequestInit = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    }

    return {
        async to(route: BackendRoutes) {
            const url = backendURL + route
            const response = await fetch(url, myInit)
            return response

        }
    }
}

export default postForm;