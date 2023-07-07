import Title from "Components/AtomComponents/Title";
import { INegotiation } from "Interfaces/INegotiation";
import NegotiationList from "./Components/NegotiationList";

function NegotiationHistoryPage() {

    const exNegotiation: INegotiation[] = [
        {
            id: 'example id',
            tradeDate: new Date('07/06/2023'),
            tradedQty: 5,
            tradedStock: 'AAPL',
            tradePrice: 24.78,
            tradeType: 'BUY'
        },
        {
            id: 'example id 2',
            tradeDate: new Date('03/15/2021'),
            tradedQty: 18,
            tradedStock: 'WEGE3',
            tradePrice: 34.51,
            tradeType: 'SELL'
        },
        {
            id: 'example id 3',
            tradeDate: new Date('09/22/2019'),
            tradedQty: 534,
            tradedStock: 'KNRI11',
            tradePrice: 157.22,
            tradeType: 'SELL'
        },
    ]
    return (
        <>
            <Title>Negotiation History</Title>
            <NegotiationList negotiationList={exNegotiation} />
        </>
    )
}

export default NegotiationHistoryPage