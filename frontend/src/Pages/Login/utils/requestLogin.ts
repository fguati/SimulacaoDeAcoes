import IUser from "Interfaces/IUser"
import backendURL from "Shared/backEndUrl"


async function requestLogin(user: IUser) {
    const route = '/login'
    const url = backendURL+route
    const myInit: RequestInit = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
        
    }
    
    const response = await fetch(url, myInit)
    return response
}

export default requestLogin