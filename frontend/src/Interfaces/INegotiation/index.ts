interface INegotiation {
    id: string
    tradeDate: Date
    tradedStock: string
    tradePrice: number
    tradedQty: number
    tradeType: 'BUY' | 'SELL'
}

export {INegotiation}