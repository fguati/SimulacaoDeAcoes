import PageLayout from "Components/PageLayout";
import StockTable from "Components/StockTable";
import Title from "Components/Title";


function HomePage() {
    return(
        <PageLayout>
            <Title>Dashboard</Title>
            <StockTable/>
        </PageLayout>
    )
}

export default HomePage