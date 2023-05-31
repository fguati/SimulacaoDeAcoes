import { currency } from "Common/Types"

export interface ApiResponseStock {
    results: Array<{
        symbol: string
        longName: string
        regularMarketPrice: number
        currency: currency

    }>
}