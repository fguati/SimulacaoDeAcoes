import StockTable from "Components/StockTable";
import Title from "Components/AtomComponents/Title";
import IStock from "Interfaces/IStock";
import { useContext, useEffect, useState } from 'react'
import useFetchPortfolio from "./utils/fetchPortfolio";
import { UserBalanceContext } from "Common/Contexts/UserBalanceContext";
import TransferFundsForm from "./Components/TransferFundsForm";

//Render the landing page for a logged in user. Still in construction.
function HomePage() {
    //get user balance from context
    const { userBalance } = useContext(UserBalanceContext)
    
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
    
    return(
        <>
            <Title>Dashboard</Title>
            <StockTable stockList={stockList} userBalance={userBalance}/>
            <TransferFundsForm/>
        </>
    )
}

export default HomePage