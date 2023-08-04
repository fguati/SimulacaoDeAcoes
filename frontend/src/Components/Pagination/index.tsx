import styled from "styled-components"
import ChangePageButton from "./components/ChangePageButton"

const PaginationContainer = styled.div`
    //Container properties
    margin: auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: var(--default-spacing);
    width: 140px;

    //Arrow icons properties
    svg{
        color: var(--button-color);
        cursor: pointer;
        &:hover{
            opacity: 50%;
        }
    }

    //page number string property
    p {
        font-size: var(--large-font-size);
        color: var(--standard-font-color);
    }

    button {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
    }
`

interface PaginationProps {
    currentPage: number
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
    lastPage?: number
}

function Pagination({ currentPage, setCurrentPage, lastPage = 1000 }: PaginationProps) {
    return (
        <PaginationContainer>
            <ChangePageButton changeTo="previous" lastPage={lastPage} setCurrentPage={setCurrentPage} />
            <p aria-label="currentPageNumber">{`${currentPage} of ${lastPage}`}</p>
            <ChangePageButton changeTo="next" lastPage={lastPage} setCurrentPage={setCurrentPage} />
        </PaginationContainer>
    )
}

export default Pagination
