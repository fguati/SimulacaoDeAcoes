import StyledTableItem from "../Table/StyledTableItem";
import ITotalValueCellProps from "./IProp";



function TotalValueCell({stock, indStock}:ITotalValueCellProps) {
    return(
        <StyledTableItem
            row={indStock + 2}
            column={6}
        >
            {(stock.qty * stock.currentPrice).toFixed(2)}
        </StyledTableItem>
    )
}

export default TotalValueCell