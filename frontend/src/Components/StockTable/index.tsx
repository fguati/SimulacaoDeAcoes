import IStock from "Interfaces/IStock"
import StandardCell from "./StandardCell"
import StyledTable from "./Table"
import StyledTableHeader from "./Table/StyledTableHeader"
import StyledTableItem from "./Table/StyledTableItem"
import TotalValueCell from "./TotalValueCell"


function StockTable() {
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

    
    return(
        <StyledTable rows={stockList.length + 1} cols={6}>
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