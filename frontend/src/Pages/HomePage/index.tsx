import StockTable from "Components/StockTable";
import Title from "Components/AtomComponents/Title";
import IStock from "Interfaces/IStock";
import { useContext, useEffect, useState } from 'react'
import useFetchPortfolio from "./utils/fetchPortfolio";
import Typography from "Components/AtomComponents/Tipography";
import useFetchUserBalance from "./utils/useFetchUserBalance";
import { UserBalanceContext } from "Common/Contexts/UserBalanceContext";

//Render the landing page for a logged in user. Still in construction.
function HomePage() {
    // //set user balance state
    // const [userBalance, setUserBalance] = useState(0)

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

    // //fetch user balance from server and set state to the response
    // const fetchUserBalance = useFetchUserBalance()
    // useEffect(() => {
    //     fetchUserBalance()
    //         .then(res => {if(res) setUserBalance(res)})
    // }, [fetchUserBalance])
    
    return(
        <>
            <Title>Dashboard</Title>
            <StockTable stockList={stockList}/>
            <Typography>{`User Balance: R$ ${userBalance.toFixed(2).toString()}`}</Typography>
        </>
    )
}

export default HomePage