import { SnackbarContext } from 'Common/Contexts/SnackbarContext'
import IErrorResponse from 'Interfaces/IErrorResponse'
import unknownError from 'Pages/ErrorPage/useErrorHandler/unknownError'
import { useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchFromServer, handleErrorResponse } from 'utils/BackendAPICommunication'
import transformErrorInResponse from 'utils/BackendAPICommunication/responseHandlers/transformErrorInResponse'

//custom hook that renders function that fetches the current user balance from the server
const usePostDeposit = (balanceSetter: React.Dispatch<React.SetStateAction<number>>) => {
    const navigate = useNavigate()
    const { activateSnackbar } = useContext(SnackbarContext)
    
    return useCallback(async (funds: number) => {
        try {
            //post funds to be deposited to the server
            const response = await fetchFromServer<{ balance: number }>('/user/deposit', 'post', {funds})
            
            //check if response does not have a body, throw unknown error
            if(!response.body) throw unknownError
            
            //if response body does not have balance it is an error response
            if(!('balance' in response.body)) throw response.body

            //call success snackbar
            activateSnackbar(`${funds} successfully transfered to your account`, { colorPalette: 'success' })
            
            //set balance state to the new balance received in the response
            balanceSetter(response.body.balance)

        } catch (err) {
            let errorResponse = err as IErrorResponse
            if(err instanceof Error) errorResponse = transformErrorInResponse(err)
            return handleErrorResponse(errorResponse, navigate)
        }
        
    }, [navigate, balanceSetter, activateSnackbar])
}

export default usePostDeposit