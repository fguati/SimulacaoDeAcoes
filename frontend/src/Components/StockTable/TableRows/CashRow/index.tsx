import StyledTableItem from "../StockRow/StyledTableItem"
import ICashRowProps from "./ICashRowProps"

//Stock table row that have only a monetary value: either the user balance or the total assets
function CashRow({ cashValue, rowLength, valueType }: ICashRowProps) {
    const rowPosition = valueType === 'User Balance' ? -1 : 0
    return (
        <>
            <StyledTableItem row={rowPosition} column={1} columnLength={rowLength - 1}>
                {valueType}
            </StyledTableItem>

            <StyledTableItem row={0} column={0}>
                {`R$ ${cashValue.toFixed(2)}`}
            </StyledTableItem>
        
        </>
    )
}

export default CashRow