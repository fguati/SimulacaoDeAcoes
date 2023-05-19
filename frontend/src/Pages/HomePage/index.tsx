import StockTable from "Components/StockTable";
import Title from "Components/AtomComponents/Title";
import IStock from "Interfaces/IStock";
import { useEffect, useState } from 'react'
import useFetchPortfolio from "./utils/fetchPortfolio";

//Render the landing page for a logged in user. Still in construction.
function HomePage() {
    const [stockList, setStockList] = useState<IStock[]>([])
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
            <StockTable stockList={stockList}/>
        </>
    )
}

export default HomePage