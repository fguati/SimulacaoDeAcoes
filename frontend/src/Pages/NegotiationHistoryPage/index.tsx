import Title from "Components/AtomComponents/Title";
import NegotiationList from "./Components/NegotiationList";
import { useState } from "react";
import Pagination from "Components/Pagination";
import NegotiationListFilters from "./Components/Filters";
import IFiltersNegotiation from "Interfaces/IFiltersNegotiation";
import useTradeHistory from "./hooks/useTradeHistory";

//Page that lists negotiations made by the user
function NegotiationHistoryPage() {
    //states that manage the pagination of the negotiation list
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(100)

    //state that manages filters
    const [filters, setFilters] = useState<IFiltersNegotiation>({})

    //effect hook that fetches negotiation list, already filtered and paginated
    const { negotiationsList } = useTradeHistory(currentPage, filters, setLastPage)

    return (
        <>
            <Title>Negotiation History</Title>
            <NegotiationListFilters setFilters={setFilters} setCurrentPage={setCurrentPage}/>
            <NegotiationList negotiationList={negotiationsList} />
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} lastPage={lastPage}/>
        </>
    )
}

export default NegotiationHistoryPage