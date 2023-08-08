import IErrorResponse from "Interfaces/IErrorResponse"
import IFiltersNegotiation from "Interfaces/IFiltersNegotiation"
import { INegotiation } from "Interfaces/INegotiation"
import INegotiationAPIRes from "Interfaces/INegotiationAPIRes"
import IServerResponse from "Interfaces/IServerResponse"
import { useEffect, useState } from "react"
import { fetchFromServer } from "utils/BackendAPICommunication"

//custom hook that fetches the trade history on server, already paginated and filtered according to the args entered
function useTradeHistory(currentPage: number, filters: IFiltersNegotiation, setLastPage: stateSetter<number>) {
    //state that manages negotiations being rendered
    const [negotiationsList, setNegotiationsList] = useState<INegotiation[]>([])

    //effect that updates the negotiation list state with data from the server
    useEffect(() => {
        const resultsPerPage = 10
        const queryParams = {
            resultsPerPage,
            pageNumber: currentPage,
            filters: filters
        }

        fetchFromServer<INegotiationAPIRes>('user/history', 'get', null, queryParams)
            .then(tradeHistResHandler(setNegotiationsList, setLastPage))
    
    }, [currentPage, filters, setLastPage])

    return { negotiationsList }

}

export default useTradeHistory

type stateSetter<stateType> = React.Dispatch<React.SetStateAction<stateType>>

//aux function that handles the response from fetching the list of negotiations from the server
function tradeHistResHandler(setNegotiationsList: stateSetter<INegotiation[]>, lastPageSetter: stateSetter<number>) {
    //response handler function returned to be used to treat the server response
    return (res: IServerResponse<INegotiationAPIRes | IErrorResponse>) => {
        if (isNegotiationAPIRes(res.body)) {
            setTradeHistToServerData(res.body, setNegotiationsList)
            determineLastPage(res.body, lastPageSetter)
        }
    }
}

//aux function that takes the trade history data fetched from the server and updates the negotiation list state with it 
function setTradeHistToServerData(resBody: INegotiationAPIRes , setNegotiationsList: stateSetter<INegotiation[]>) {
    const newNegotiationList = getTradeList(resBody);
    setNegotiationsList(newNegotiationList);
}

//typeguard for the API response body
function isNegotiationAPIRes(responseBody: INegotiationAPIRes | IErrorResponse | undefined): responseBody is INegotiationAPIRes {
    return Boolean(responseBody && 'negotiations' in responseBody)
}

//aux function that takes number of pages returned by server and use it to determine the last page number
function determineLastPage(resBody: INegotiationAPIRes , lastPageSetter: stateSetter<number>) {
    const lastPage = resBody.numberOfPages
    lastPageSetter(lastPage);
}

//aux function that takes trade list from the body of the server response while converting the tradeDate property of all its elements into Date objects
function getTradeList(resposeBody: INegotiationAPIRes) {
    return resposeBody.negotiations.map(neg => ({ ...neg, tradeDate: new Date(neg.tradeDate) }));
}