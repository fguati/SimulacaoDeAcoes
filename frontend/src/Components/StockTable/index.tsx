import IStockTableProps from "./IStockTableProps"
import StyledTable from "./StyledTable"
import HeaderRow from "./TableRows/HeaderRow"
import StockRow from "./TableRows/StockRow"
import CashRow from "./TableRows/CashRow"

//renders a table with the stock portfolio received as a list, showing all the information regarding said portfolio 
function StockTable({ stockList, userBalance }:IStockTableProps) {
    //list of headers of the table
    const headers = [
        'Ticker',
        'Company Name',
        'Stock quantity',
        'Current Price',
        'Currency',
        'Average Price',
        'Total Value'
    ]

    //add the total current value of all stocks in user portfolio and the user balance to have the users total assets
    const userTotalAssets = stockList.reduce((acum, stock) => {
        const {totalValue, currentPrice, qty} = stock
        return acum + (totalValue ?? (currentPrice * (qty ?? 0)))
    }, userBalance)
    
    const tableLength = headers.length

    return(
        // the StyledTable component will render the table. Each stock is a row, with one additional for the headers row, one for the user balance and one for total equity. Each headers will be one column
        <StyledTable rows={stockList.length + 1} cols={tableLength} role={'table'}>
            {/* render headers row */}
            <HeaderRow headers={headers} />

            {/* render each stock row */}
            {stockList.map((stock, indStock) => (
                <StockRow stock={stock} stockIndex={indStock} key={stock.id}/>
            ))}

            {/* render row with user current balance */}
            <CashRow valueType="User Balance" cashValue={userBalance} key={'userBalance'} rowLength={tableLength}/>

            {/* render row with user total assets */}
            <CashRow valueType="Total Assets" cashValue={userTotalAssets} rowLength={tableLength} key={'userTotalAssets'} />

        </StyledTable>
    )
}

export default StockTable