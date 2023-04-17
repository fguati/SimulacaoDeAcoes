import axios from "axios"

const backendURL = 'http://localhost:8000'

//created a base data for requests with axios, centralizing any need to change the base url of the backend
export const httpBackEndAPI = axios.create({
    baseURL: backendURL,
    validateStatus: function (status) {
        return status < 600;
    },
})

export default backendURL