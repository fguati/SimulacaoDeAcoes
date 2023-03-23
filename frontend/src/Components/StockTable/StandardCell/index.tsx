import IStock from "Interfaces/IStock";
import StyledTableItem from "../Table/StyledTableItem";
import IStandardCellProps from "./IProps";

function StandardCell({stock, Property, indProperty, indStock}: IStandardCellProps) {
    return (
        <StyledTableItem
            row={indStock + 2}
            column={indProperty + 1}
        >
            {stock[Property as keyof IStock]}
        </StyledTableItem>
    )
}

export default StandardCell