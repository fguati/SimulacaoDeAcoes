import { currency } from "Common/Types"

export interface ApiResponseStock {
    results: Array<{
        symbol: string
        longName: string
        regularMarketPrice: number
        currency: currency

    }>
}

export interface ApiResponseAvailable {
    indexes: string[]
    stocks: string[]
}