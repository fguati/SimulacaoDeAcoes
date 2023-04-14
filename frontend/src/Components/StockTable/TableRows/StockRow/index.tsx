import StandardCell from "./StandardCell"
import TotalValueCell from "./TotalValueCell"
import IStockRowProps from "./IStockRowProps"

function StockRow({ stock, stockIndex }: IStockRowProps) {
    const stockProperties = [
        'id',
        'ticker',
        'companyName',
        'qty',
        'currentPrice',
        'totalValue'
    ]
    
    return (
        <>
            {/* render each cell of the row with one of the stock properties */}
            {stockProperties.map((Property, indProperty) => {
                //first check if the property being rendered is total value, as this one has its value calculated
                if(Property === 'totalValue') {
                    return <TotalValueCell
                        key={`${stock.id}/6`}
                        indStock={stockIndex} 
                        stock={stock} 
                    />
                }
                
                //render the current cell with the current property
                return <StandardCell 
                    key={`${stock.id}/${indProperty}`}
                    Property={Property}
                    stock={stock}
                    indProperty={indProperty}
                    indStock={stockIndex}
                />
            })}
        </>
    )
}

export default StockRow