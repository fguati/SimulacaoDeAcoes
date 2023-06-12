import StockTable from "Components/StockTable";
import Title from "Components/AtomComponents/Title";
import { useContext } from 'react'
import { UserAssetContext } from "Common/Contexts/UserBalanceContext";
import TransferFundsForm from "./Components/TransferFundsForm";

//Render the landing page for a logged in user. Still in construction.
function HomePage() {
    //get user balance and portfolio from context
    const { userBalance, stockList } = useContext(UserAssetContext)
    
    return(
        <>
            <Title>Dashboard</Title>
            <StockTable stockList={stockList} userBalance={userBalance}/>
            <TransferFundsForm/>
        </>
    )
}

export default HomePage