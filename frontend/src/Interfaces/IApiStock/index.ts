import { currency } from "Common/Types"

interface IApiStock {
    ticker: string
    companyName: string
    currentPrice: number
    currency: currency
}

export default IApiStock