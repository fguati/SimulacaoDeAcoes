import backendURL from "Common/backEndUrl";

function submitForm<bodyType>(body:bodyType) {
    const myInit: RequestInit = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    }

    return {
        async to(route: string) {
            const url = backendURL + route
            const response = await fetch(url, myInit)
            return response

        }
    }
}

export default submitForm;