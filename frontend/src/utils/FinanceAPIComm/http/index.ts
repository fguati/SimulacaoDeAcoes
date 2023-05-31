import axios from "axios";

const httpFinAPI = axios.create({
    baseURL: 'https://brapi.dev/api/',
    headers: {
        'Accept': 'application/json'
    },
    timeout: 3000,
    method: 'get'
})

export default httpFinAPI