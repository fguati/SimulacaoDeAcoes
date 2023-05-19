import { backendURL } from "Common/Constants";
import axios from "axios";


const httpServer = axios.create({
    baseURL: backendURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 3000,
    withCredentials: true
})

export default httpServer
