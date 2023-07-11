import Title from "Components/AtomComponents/Title";
import { INegotiation } from "Interfaces/INegotiation";
import NegotiationList from "./Components/NegotiationList";
import { useEffect, useState } from "react";
import { fetchFromServer } from "utils/BackendAPICommunication";
import INegotiationAPIRes from "Interfaces/INegotiationAPIRes";
import IServerResponse from "Interfaces/IServerResponse";
import IErrorResponse from "Interfaces/IErrorResponse";
import Pagination from "Components/Pagination";

//Page that lists negotiations made by the user
function NegotiationHistoryPage() {
    //state that manages the pagination of the negotiation list
    const [currentPage, setCurrentPage] = useState(1)

    //state that manages negotiations being rendered
    const [negotiationsList, setNegotiationsList] = useState<INegotiation[]>([])

    //effect that updates the negotiation list state with data from the server
    useEffect(() => {
        const resultsPerPage = 10
        const queryParams = {
            resultsPerPage,
            pageNumber: currentPage
        }
        
        fetchFromServer<INegotiationAPIRes>('user/history', 'get', null, queryParams)
            .then(setTradeHistToServerData(setNegotiationsList))
    }, [currentPage])

    return (
        <>
            <Title>Negotiation History</Title>
            <NegotiationList negotiationList={negotiationsList} />
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} lastPage={7}/>
        </>
    )
}

export default NegotiationHistoryPage

//aux function that takes the trade history data fetched from the server and updates the negotiation list state with it 
function setTradeHistToServerData(setNegotiationsList: React.Dispatch<React.SetStateAction<INegotiation[]>>): ((value: IServerResponse<INegotiationAPIRes | IErrorResponse>) => void | PromiseLike<void>) | null | undefined {
    return res => {
        if (isNegotiationAPIRes(res.body)) {
            const newNegotiationList = getTradeList(res.body);
            setNegotiationsList(newNegotiationList);
        }
    };
}

//aux function that takes trade list from the body of the server response while converting the tradeDate property of all its elements into Date objects
function getTradeList(resposeBody: INegotiationAPIRes) {
    return resposeBody.negotiations.map(neg => ({ ...neg, tradeDate: new Date(neg.tradeDate) }));
}

//typeguard for the API response body
function isNegotiationAPIRes(responseBody: INegotiationAPIRes | IErrorResponse | undefined): responseBody is INegotiationAPIRes {
    return Boolean(responseBody && 'negotiations' in responseBody)
}


