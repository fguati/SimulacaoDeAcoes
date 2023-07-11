import Title from "Components/AtomComponents/Title";
import { INegotiation } from "Interfaces/INegotiation";
import NegotiationList from "./Components/NegotiationList";
import { useEffect, useState } from "react";
import { fetchFromServer } from "utils/BackendAPICommunication";

function NegotiationHistoryPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [negotiationsList, setNegotiationsList] = useState<INegotiation[]>([])

    useEffect(() => {
        const resultsPerPage = 9
        const queryParams = {
            resultsPerPage,
            pageNumber: currentPage
        }
        
        fetchFromServer<NegotiationAPIResponse>('user/history', 'get', null, queryParams)
            .then(res => {
                if (res.body && 'negotiations' in res.body) {
                    const newNegotiationList = res.body.negotiations.map(neg => ({...neg, tradeDate: new Date(neg.tradeDate)}))
                    setNegotiationsList(newNegotiationList)
                }
            })
    }, [currentPage])

    return (
        <>
            <Title>Negotiation History</Title>
            <NegotiationList negotiationList={negotiationsList} />
        </>
    )
}

export default NegotiationHistoryPage

interface NegotiationAPIResponse {
    negotiations: INegotiation[]
}