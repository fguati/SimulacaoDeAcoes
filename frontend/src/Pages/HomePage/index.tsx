import StockTable from "Components/StockTable";
import Title from "Components/AtomComponents/Title";
import IStock from "Interfaces/IStock";
import { useEffect, useState } from 'react'
import useFetchPortfolio from "./utils/fetchPortfolio";
import Typography from "Components/AtomComponents/Tipography";
import { fetchFromServer, handleErrorResponse } from "utils/BackendAPICommunication";
import { useNavigate } from "react-router-dom";
import transformErrorInResponse from "utils/BackendAPICommunication/responseHandlers/transformErrorInResponse";
import unknownError from "Pages/ErrorPage/useErrorHandler/unknownError";

//Render the landing page for a logged in user. Still in construction.
function HomePage() {
    //set user balance state
    const [userBalance, setUserBalance] = useState(0)
    
    //set state that will populate the stock table
    const [stockList, setStockList] = useState<IStock[]>([])
    
    //fetch the stock data from db and set state to the response
    const fetchPortfolio = useFetchPortfolio()
    useEffect(() => {
        const response = fetchPortfolio()
        response.then(portfolio => {
            setStockList(portfolio!)
        })
    }, [fetchPortfolio])

    //fetch user balance from server
    const navigate = useNavigate()
    useEffect(() => {
        fetchFromServer<{balance: number}>('/user/balance')
            .then(response => {
                if(response.body) {
                    if('balance' in response.body){
                        return setUserBalance(response.body.balance)
                    } 
                    
                    throw response.body
                }

                throw unknownError
                
            })
            .catch(err => handleErrorResponse(transformErrorInResponse(err), navigate))
        
    }, [navigate])
    
    return(
        <>
            <Title>Dashboard</Title>
            <StockTable stockList={stockList}/>
            <Typography>{`User Balance: R$ ${userBalance.toFixed(2).toString()}`}</Typography>
        </>
    )
}

export default HomePage