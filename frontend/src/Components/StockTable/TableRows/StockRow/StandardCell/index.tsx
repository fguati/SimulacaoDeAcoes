import IStock from "Interfaces/IStock";
import StyledTableItem from "../StyledTableItem";
import IStandardCellProps from "./IProps";
import { displayMonetaryValue } from "utils/displayFunctions";

//renders a standard table cell with the property of the stock received as props
function StandardCell({stock, Property, indProperty, indStock}: IStandardCellProps) {
    const stockPropertyValue = stock[Property as keyof IStock]
    const propertyIsMonetary = Property === 'currentPrice' || Property === 'totalValue' || Property === 'averagePrice'
    const dataToDisplay = typeof stockPropertyValue === 'number' && propertyIsMonetary ? 
        displayMonetaryValue(stockPropertyValue) : 
        stockPropertyValue
    
    return (
        /** the row number must be the index of the stock +2 because the first row is 
         * the header row and the first stock in the stock list will have index 0. 
         * The col number has to be the property index +1 because the first property of
         * the property list will have index 0
        */
        <StyledTableItem
            row={indStock + 2}
            column={indProperty + 1}
        >
            {dataToDisplay}
        </StyledTableItem>
    )
}

export default StandardCell