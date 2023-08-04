import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa"
import { useCallback } from "react"

interface IChangePageButtonProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
    lastPage: number
    changeTo: 'next' | 'previous'
}

//component responsible for changing pages in the pagination
function ChangePageButton({ setCurrentPage, lastPage, changeTo }: IChangePageButtonProps) {
    const nextPage = useChangePage(1, lastPage)
    const previouPage = useChangePage(-1, lastPage)
    const buttonSize = '22px'

    return (
        <button onClick={() => setCurrentPage(changeTo === 'next' ? nextPage : previouPage)} aria-label={changeTo === 'next' ? 'nextPage' : 'previousPage'}>
            {changeTo === 'next' ? <FaArrowCircleRight size={buttonSize} /> : <FaArrowCircleLeft size={buttonSize} />}
        </button>
    )
}

export default ChangePageButton

//aux custom hook that render the function that determines to which page should be changed
function useChangePage(pagesChanged: 1 | -1, lastPageNumber: number) {
    return useCallback((currentPageNumber: number) => {
        const newPageNumber = currentPageNumber + pagesChanged
        const isValidPage = (newPageNumber > 0 && newPageNumber <= lastPageNumber)
        if (isValidPage) return newPageNumber
        return currentPageNumber
    }, [lastPageNumber, pagesChanged])
}