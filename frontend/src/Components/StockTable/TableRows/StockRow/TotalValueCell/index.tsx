import StyledTableItem from "../StyledTableItem";
import ITotalValueCellProps from "./IProp";

//renders a table cell with the total value of the stock received as prop
function TotalValueCell({stock, indStock}:ITotalValueCellProps) {
    return(
        // the row number must be the index of the stock +2 because the first row is the header row and the first stock in the stock list will have index 0
        <StyledTableItem
            row={indStock + 2}
            column={6}
        >
            {((stock.qty ?? 0) * stock.currentPrice).toFixed(2)}
        </StyledTableItem>
    )
}

export default TotalValueCell