import StyledTableHeader from "./StyledTableHeader"
import IHeaderRowProps from "./IHeaderRowProps"

function HeaderRow({ headers }: IHeaderRowProps) {
    return (
        <>
            {headers.map((header, index) => (
                <StyledTableHeader 
                    key={index} 
                    col={index + 1}
                >
                    {header}
                </StyledTableHeader>
            ))}
        </>
    )
}

export default HeaderRow