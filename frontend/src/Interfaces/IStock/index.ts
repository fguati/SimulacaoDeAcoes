/**
 * Interface that determines the properties of a stock. Might become or be extended into a full class eventually
 */
interface IStock {
    id: string,
    ticker: string,
    companyName: string,
    qty: number,
    currentPrice: number,
    totalValue?: number
}

export default IStock