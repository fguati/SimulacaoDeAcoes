import IUser from "Interfaces/IUser";
import backendURL from "Shared/backEndUrl";

const url = backendURL + '/register'

async function signUpRequest(user: IUser) {
    
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
        
    })
    
    return response
}

export default signUpRequest