import IErrorResponse from 'Interfaces/IErrorResponse'
import unknownError from 'Pages/ErrorPage/useErrorHandler/unknownError'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchFromServer, handleErrorResponse } from 'utils/BackendAPICommunication'
import transformErrorInResponse from 'utils/BackendAPICommunication/responseHandlers/transformErrorInResponse'

//custom hook that renders function that fetches the current user balance from the server
const useFetchUserBalance = () => {
    const navigate = useNavigate()
    
    return useCallback(async () => {
        try {
            //fetch user balance from database
            const response = await fetchFromServer<{balance: number}>('/user/balance')
            
            //check if response has a bodyand, if doesn't throw error
            if(response.body) {
                //if response body has balance return it. Else means the response is an error and should be thrown
                if('balance' in response.body){
                    return response.body.balance
                }
                
                throw response.body
            }
        
            throw unknownError

        } catch (err) {
            let errorResponse = err as IErrorResponse
            if(err instanceof Error) errorResponse = transformErrorInResponse(err)
            return handleErrorResponse(errorResponse, navigate)
        }
        
    }, [navigate])
}

export default useFetchUserBalance