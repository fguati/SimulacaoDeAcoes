import PageLayout from "Components/PageLayout";
import StockTable from "Components/StockTable";
import Title from "Components/AtomComponents/Title";
import IStock from "Interfaces/IStock";

//temporary mock portfolio data. Will eventually be replaced by data received from the backend API
const stockList: IStock[] = [
    {
        id: Math.random().toString(),
        ticker: 'WEGE3',
        companyName: 'Weg',
        qty: 237,
        currentPrice: 25.37,
    },
    {
        id: Math.random().toString(),
        ticker: 'EGIE3',
        companyName: 'Engie',
        qty: 315,
        currentPrice:15.17,
    },
    {
        id: Math.random().toString(),
        ticker: 'ITUB4',
        companyName: 'Banco Itaú',
        qty: 17,
        currentPrice: 155.48,
    }
]

//Render the landing page for a logged in user. Still in construction.
function HomePage() {
    return(
        <PageLayout>
            <Title>Dashboard</Title>
            <StockTable stockList={stockList}/>
        </PageLayout>
    )
}

export default HomePage