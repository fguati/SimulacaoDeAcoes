import IStockTableProps from "./IStockTableProps"
import StandardCell from "./StandardCell"
import StyledTable from "./Table"
import StyledTableHeader from "./Table/StyledTableHeader"
import TotalValueCell from "./TotalValueCell"

function StockTable({ stockList }:IStockTableProps) {
    const propertyToHeadersMap = {
        id: 'id',
        ticker: 'Ticker',
        companyName: 'Nome',
        qty: 'Quantidade de Ações',
        currentPrice: 'Preço Atual',
        totalValue: 'Valor Total'
    }
    
    const stockProperties = Object.keys(propertyToHeadersMap)
    const headers = Object.values(propertyToHeadersMap)
    

    
    return(
        <StyledTable rows={stockList.length + 1} cols={6} role={'table'}>
            {headers.map((header, index) => <StyledTableHeader key={index} col={index + 1}>{header}</StyledTableHeader>)}

            {stockList.map((stock, indStock) => {
                return stockProperties.map((Property, indProperty) => {
                    if(Property === 'totalValue'){
                        return <TotalValueCell 
                            key={`${stock.id}/6`}
                            indStock={indStock} 
                            stock={stock} 
                        />
                    }
                    
                    return <StandardCell 
                        key={`${stock.id}/${indProperty}`}
                        Property={Property}
                        stock={stock}
                        indProperty={indProperty}
                        indStock={indStock}
                    />
                })
            })}
            

        </StyledTable>
    )
}

export default StockTable