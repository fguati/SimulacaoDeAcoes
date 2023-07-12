import styled from "styled-components"
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa'
import { useCallback } from "react"

const PaginationContainer = styled.div`
    //Container properties
    margin: auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: var(--default-spacing);
    width: 100px;

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
`

interface PaginationProps {
    currentPage: number
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
    lastPage?: number
}

function Pagination({ currentPage, setCurrentPage, lastPage = 1000 }: PaginationProps) {
    const nextPage = useChangePage(1, lastPage)
    const previouPage = useChangePage(-1, lastPage)  

    return (
        <PaginationContainer>
            <FaArrowCircleLeft size={'22px'} onClick={() => setCurrentPage(previouPage)} aria-label='previousPage' />
            <p aria-label="currentPageNumber">{currentPage}</p>
            <FaArrowCircleRight size={'22px'} onClick={() => setCurrentPage(nextPage)} aria-label='nextPage' />
        </PaginationContainer>
    )
}

export default Pagination

//aux custom hook that render the function that determines to which page should be changed
function useChangePage(pagesChanged: 1 | -1, lastPageNumber: number) {
    return useCallback((currentPageNumber: number) => {
        const newPageNumber = currentPageNumber + pagesChanged
        const isValidPage = (newPageNumber > 0 && newPageNumber <= lastPageNumber)
        if (isValidPage) return newPageNumber
        return currentPageNumber
    },[lastPageNumber, pagesChanged])
}