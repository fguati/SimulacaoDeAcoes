import { displayMonetaryValue } from "utils/displayFunctions"
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

            <StyledTableItem row={rowPosition} column={0}>
                {displayMonetaryValue(cashValue)}
            </StyledTableItem>
        
        </>
    )
}

export default CashRow