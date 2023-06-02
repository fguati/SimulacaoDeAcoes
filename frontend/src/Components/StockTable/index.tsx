import IStockTableProps from "./IStockTableProps"
import StyledTable from "./StyledTable"
import HeaderRow from "./TableRows/HeaderRow"
import StockRow from "./TableRows/StockRow"

//renders a table with the stock portfolio received as a list, showing all the information regarding said portfolio 
function StockTable({ stockList }:IStockTableProps) {
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
    
    return(
        // the StyledTable component will render the table. Each stock is a row, with one additional for the headers row. Each headers will be one column
        <StyledTable rows={stockList.length + 1} cols={headers.length} role={'table'}>
            {/* render headers row */}
            <HeaderRow headers={headers} />

            {/* render each stock row */}
            {stockList.map((stock, indStock) => (
                <StockRow stock={stock} stockIndex={indStock} key={stock.id}/>
            ))}
        </StyledTable>
    )
}

export default StockTable