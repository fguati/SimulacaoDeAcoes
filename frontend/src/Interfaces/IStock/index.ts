

interface IStock {
    id: string,
    ticker: string,
    companyName: string,
    qty: number,
    currentPrice: number,
    totalValue?: number
}

export default IStock